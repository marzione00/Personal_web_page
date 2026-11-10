"""CI browser smoke tests. Run against the built dist directory, never against production."""
from pathlib import Path
import json
import traceback
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from time import monotonic, sleep
from playwright.sync_api import sync_playwright, expect


# Readiness is a renderer state, not a translated instruction or a motion mode.
# Poll from Python: page-side polling evaluates strings inside the page and
# conflicts with the production CSP. Keep CSP enabled throughout this suite.
def wait_for_renderer(page, predicate, description, timeout=10):
    deadline=monotonic()+timeout
    while True:
        if page.evaluate(predicate):
            return
        if monotonic()>=deadline:
            state=page.locator('#geometry-dialog [data-geo-status]').text_content()
            raise AssertionError(f'{description}; viewer status: {state}')
        sleep(.05)

def expect_geometry_ready(page, dialog):
    expect(dialog).to_be_visible()
    expect(dialog.locator('#geometry-stage canvas')).to_have_count(1,timeout=15000)
    expect(dialog.locator('#geometry-stage canvas')).to_be_visible()
    wait_for_renderer(page, """() => {
        const v=window.MDCGeometryDebug?.viewer;
        return Boolean(v?.alive && v.model?.ix?.length &&
            v.host===document.querySelector('#geometry-dialog #geometry-stage'));
    }""", 'The geometry renderer did not become ready')

def expect_geometry_motion(page, dialog, *, reduced, english=False, auto=True):
    expect_geometry_ready(page,dialog)
    message=(('Your system requests reduced motion. Use the orientation controls.' if english else
              'Il sistema richiede movimento ridotto. Usa i controlli di orientamento.') if reduced else
             ('Drag to explore the model. Use the controls to change its display.' if english else
              'Trascina per esplorare il modello. Usa i controlli per cambiare la visualizzazione.'))
    expect(dialog.locator('[data-geo-status]')).to_have_text(message)
    expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-disabled',str(reduced).lower())
    expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed',str(auto and not reduced).lower())
    assert page.evaluate('Boolean(window.MDCGeometryDebug.viewer.auto)') == (auto and not reduced)
    if reduced:
        assert page.evaluate('window.MDCGeometryDebug.viewer.raf')==0

def expect_manual_orientation(page, dialog):
    before=page.evaluate('window.MDCGeometryDebug.viewer.angle[1]')
    dialog.locator('[data-geo-right]').click()
    assert page.evaluate('window.MDCGeometryDebug.viewer.angle[1]') > before+.1
    expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','false')
    assert page.evaluate('window.MDCGeometryDebug.viewer.raf')==0

def select_geometry_preset(page, dialog, preset):
    """Target the live viewer, not the atlas's hidden source controls."""
    expect_geometry_ready(page,dialog)
    button=dialog.locator(f'[data-geo-presets] [data-geo-preset="{preset}"]')
    expect(button).to_have_count(1)
    expect(button).to_be_visible()
    button.click()
    expect(dialog.locator('#geometry-stage')).to_have_attribute('data-geometry-scene',preset)
    expect(button).to_have_attribute('aria-pressed','true')
    expect(dialog.locator('[data-geo-status]')).to_have_text(button.inner_text())
    expect(dialog.locator('[data-geo-preset][aria-pressed="true"]')).to_have_count(1)
    legend=dialog.locator('[data-geo-legend]:visible')
    expect(legend).to_have_count(1)
    expect(legend).to_have_attribute('data-geo-legend',preset)

def wait_for_light_change(page, previous_phase, timeout=10):
    """Poll the renderer from the test process; avoid waitForFunction's page-side eval."""
    deadline=monotonic()+timeout
    while True:
        phase=page.evaluate('window.MDCGeometryDebug?.viewer?.lightPhase ?? null')
        if phase is not None and phase>previous_phase:
            return
        if monotonic()>=deadline:
            raise AssertionError(f'Geometry light did not advance within {timeout}s: previous={previous_phase}, current={phase}')
        sleep(.05)

def report_failure(page):
    try:
        details=page.evaluate("""() => {
            const d=document.querySelector('#geometry-dialog');
            const v=window.MDCGeometryDebug?.viewer;
            return {url:location.href,language:document.documentElement.lang,
                viewport:{width:innerWidth,height:innerHeight},
                reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,
                status:d?.querySelector('[data-geo-status]')?.textContent,
                scene:d?.querySelector('#geometry-stage')?.dataset.geometryScene,
                canvasCount:d?.querySelectorAll('#geometry-stage canvas').length,
                spin:{pressed:d?.querySelector('[data-geo-spin]')?.getAttribute('aria-pressed'),
                    disabled:d?.querySelector('[data-geo-spin]')?.getAttribute('aria-disabled')},
                renderer:{alive:v?.alive,model:!!v?.model,auto:v?.auto,raf:v?.raf},
                effectsPaused:window.MDCEffects?.paused};
        }""")
        details['traceback']=traceback.format_exc()
        print('BROWSER FAILURE STATE\n'+json.dumps(details,ensure_ascii=False,indent=2),flush=True)
        output=root/'reports'/'browser-revision'
        output.mkdir(parents=True,exist_ok=True)
        (output/'failure.json').write_text(json.dumps(details,ensure_ascii=False,indent=2))
        page.screenshot(path=str(output/'failure.png'),full_page=True)
    except Exception as error:
        print(f'Could not capture extra browser diagnostics: {error}',flush=True)

root=Path(__file__).resolve().parents[1]
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root/'dist')))
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        page=None
        try:
            for width,height in [(1440,900),(390,844)]:
                context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
                page=context.new_page(); errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
                dialog=page.locator('#geometry-dialog')
                for prefix in ['', 'en/']:
                    print(f'Reduced motion: {width}x{height}, {prefix or "it"}',flush=True)
                    page.goto(url+prefix+'index.html');expect(page.locator('h1')).to_be_visible()
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                    page.locator('[data-carbon-lattice]').first.scroll_into_view_if_needed()
                    expect(page.locator('[data-carbon-lattice] canvas')).to_have_count(0)
                    page.locator('[data-open-search]').click();page.locator('#dialog-search').fill('Bloch')
                    expect(page.locator('#dialog-results .search-row').first).to_be_visible()
                    page.keyboard.press('Escape');expect(page.locator('[data-open-search]')).to_be_focused()
                    page.goto(url+prefix+'esperimenti.html')
                    for slider in page.locator('[data-experiment] input[type=range]').all():slider.focus();slider.press('ArrowRight')
                    expect(page.locator('[data-experiment]')).to_have_count(3)
                    page.locator('#decision-threshold').press('End')
                    expect(page.locator('#decision [data-experiment-result]')).to_contain_text('Class 0' if prefix else 'Classe 0')
                    page.goto(url+prefix+'geometrie.html')
                    expect(page.locator('[data-geometry-open]')).to_have_count(28)
                    for card in page.locator('[data-geometry-open]').all():
                        model=card.get_attribute('data-geometry-open')
                        print(f'  Reduced geometry: {model}',flush=True)
                        card.click()
                        expect_geometry_motion(page,dialog,reduced=True,english=bool(prefix))
                        expect_manual_orientation(page,dialog)
                        dialog.locator('[data-geo-close]').click()
                        expect(card).to_be_focused()
                    # The atlas retains hidden preset sources while the dialog owns the active controls.
                    schwarzite=page.locator('[data-geometry-open="schwarzite-neck"]')
                    schwarzite.click()
                    expect_geometry_motion(page,dialog,reduced=True,english=bool(prefix))
                    for preset in ['schwarzite-sections','schwarzite-lattice','schwarzite-neck']:
                        select_geometry_preset(page,dialog,preset)
                        expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-disabled','true')
                        expect_manual_orientation(page,dialog)
                    dialog.locator('[data-geo-close]').click()
                    expect(schwarzite).to_be_focused()
                    # Reopening replaces the live controls rather than accumulating another set.
                    schwarzite.click()
                    expect_geometry_motion(page,dialog,reduced=True,english=bool(prefix))
                    expect(dialog.locator('[data-geo-presets]')).to_have_count(1)
                    expect(dialog.locator('[data-geo-preset]')).to_have_count(3)
                    select_geometry_preset(page,dialog,'schwarzite-sections')
                    dialog.locator('[data-geo-close]').click()
                    # A new opening follows the current media preference, in both languages.
                    page.emulate_media(reduced_motion='no-preference')
                    schwarzite.click()
                    expect_geometry_motion(page,dialog,reduced=False,english=bool(prefix))
                    for preset in ['schwarzite-sections','schwarzite-lattice','schwarzite-neck']:
                        select_geometry_preset(page,dialog,preset)
                    expect_manual_orientation(page,dialog)
                    dialog.locator('[data-geo-close]').click()
                    page.emulate_media(reduced_motion='reduce')
                    page.goto(url+prefix+'tema-cybersecurity.html')
                    graph=page.locator('[data-cyber-open]')
                    expect(graph).to_have_count(1)
                    expect(graph.locator('.cyber-node')).to_have_count(96)
                    assert graph.locator('.cyber-node.is-hit').count()>0
                    assert graph.locator('.cyber-node:not(.is-hit)').count()>0
                    assert graph.locator('svg text, input, select, button').count()==0
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                    graph.click();expect(page.locator('#cyber-dialog')).to_be_visible()
                    expect(page.locator('#cyber-title')).to_have_text('Graph theory and cyber-attacks' if prefix else 'Teoria dei grafi e cyber-attacchi')
                    page.keyboard.press('Escape');expect(graph).to_be_focused()
                    page.goto(url+prefix+'corso-quantum-post-quantum-computing-2026-2027.html#argomento-quantum-2026-2027-modulo-01-96')
                    expect(page.locator('#argomento-quantum-2026-2027-modulo-01-96')).to_be_visible()
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                    page.goto(url+prefix+'cv.html')
                    page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
                    expect(page.locator('main details:not([open])')).to_have_count(0)
                    page.evaluate("window.dispatchEvent(new Event('afterprint'))")
                assert not errors,errors
                context.close()
        except Exception:
            if page is not None and not page.is_closed():
                report_failure(page)
            raise
        finally:
            browser.close()
finally:
    server.shutdown()
    server.server_close()
print('Desktop/mobile IT/EN search, experiments, reduced motion, focus, deep links and print passed.')

# Progressive routing must preserve the player and reinitialise page controls.
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root/'dist')))
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        page=None
        try:
            context=browser.new_context(viewport={'width':390,'height':844},reduced_motion='no-preference')
            page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
            dialog=page.locator('#geometry-dialog')
            page.goto(url);expect(page.locator('[data-entry-dialog]')).to_be_visible()
            assert page.evaluate('!window.ManifoldMusic.loaded')
            page.locator('[data-entry-audio="on"]').click()
            expect(page.locator('[data-entry-dialog]')).not_to_be_visible(timeout=5000)
            expect(page.locator('[data-music-play]')).to_have_attribute('aria-pressed','true',timeout=10000)
            origin=page.evaluate('performance.timeOrigin')
            page.locator('.hero .actions a[href="didattica.html"]').click()
            expect(page.locator('body')).to_have_attribute('data-page','didattica.html')
            assert page.evaluate('performance.timeOrigin')==origin
            assert page.evaluate('window.ManifoldMusic.playing')
            page.locator('.footer a[href="esperimenti.html"]').click()
            expect(page.locator('body')).to_have_attribute('data-page','esperimenti.html')
            page.locator('#decision-threshold').press('End')
            expect(page.locator('#decision [data-experiment-result]')).to_contain_text('Classe 0')
            page.go_back();expect(page.locator('body')).to_have_attribute('data-page','didattica.html')
            page.go_forward();expect(page.locator('body')).to_have_attribute('data-page','esperimenti.html')
            assert page.evaluate('performance.timeOrigin')==origin
            page.locator('.footer a[href="geometrie.html"]').click()
            expect(page.locator('body')).to_have_attribute('data-page','geometrie.html')
            page.locator('[data-geometry-open]').first.click()
            expect(page.locator('#geometry-dialog')).to_be_visible()
            expect_geometry_motion(page,dialog,reduced=False)
            dialog.locator('[data-geo-close]').click()
            page.locator('.brand').first.click()
            expect(page.locator('body')).to_have_attribute('data-page','index.html')
            expect(page.locator('[data-entry-dialog]')).not_to_be_visible()
            expect(page.locator('.construction-code, .portrait-shutters')).to_have_count(0,timeout=10000)
            assert page.evaluate('window.ManifoldMusic.playing')
            assert page.evaluate('window.MDCNavigation.stats.visits')>=6
            assert page.evaluate('window.MDCNavigation.stats.fallbacks')==0
            ids=page.locator('[id]').evaluate_all('(nodes)=>nodes.map(n=>n.id)')
            assert len(ids)==len(set(ids))
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.locator('[data-open-search]').click();page.locator('#dialog-search').fill('ransomware')
            page.locator('#dialog-results .search-row').first.click()
            expect(page.locator('body')).to_have_attribute('data-page','ricerca.html')
            expect(page.locator('#pub-03')).to_be_focused()
            page.locator('.brand').first.click()
            expect(page.locator('body')).to_have_attribute('data-page','index.html')
            # An explicit silent replay also stops the existing audio.
            page.locator('[data-entry-replay]').click();page.locator('[data-entry-audio="off"]').click()
            expect(page.locator('[data-entry-dialog]')).not_to_be_visible(timeout=5000)
            expect(page.locator('[data-music-play]')).to_have_attribute('aria-pressed','false')
            expect(page.locator('[data-sound-toggle]')).to_have_attribute('aria-pressed','false')
            # Carbon autoplay is visibility-driven; manual exploration and motion preferences stop it.
            carbon=page.locator('[data-geometry-open="fullerene-cage"]')
            carbon.scroll_into_view_if_needed();expect(carbon).to_have_attribute('data-geometry-motion','running')
            carbon.click();expect_geometry_motion(page,dialog,reduced=False)
            page.emulate_media(reduced_motion='reduce')
            expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-disabled','true')
            expect_manual_orientation(page,dialog)
            page.emulate_media(reduced_motion='no-preference')
            expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-disabled','false')
            expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','false')
            dialog.locator('[data-geo-spin]').click()
            expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','true')
            phase=page.evaluate('MDCGeometryDebug.viewer.lightPhase')
            wait_for_light_change(page,phase)
            assert page.evaluate('!MDCGeometryDebug.viewer.gl || MDCGeometryDebug.viewer.gl.getError()===0')
            dialog.locator('[data-geo-right]').click()
            expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','false')
            assert page.evaluate('MDCGeometryDebug.viewer.raf===0')
            dialog.locator('[data-geo-close]').click();expect(carbon).to_have_attribute('data-geometry-motion','running')
            page.emulate_media(reduced_motion='reduce');expect(carbon).to_have_attribute('data-geometry-motion','paused')
            page.emulate_media(reduced_motion='no-preference');expect(carbon).to_have_attribute('data-geometry-motion','running')
            page.locator('.hero').scroll_into_view_if_needed()
            expect(page.locator('[data-carbon-lattice] canvas')).to_have_count(0)
            page.locator('.hero .actions a[href="ricerca.html"]').click()
            expect(page.locator('body')).to_have_attribute('data-page','ricerca.html')
            bilayer=page.locator('[data-geometry-open="bilayer-nanoflake"]')
            bilayer.scroll_into_view_if_needed();expect(bilayer).to_have_attribute('data-geometry-motion','running')
            print('Animated geometry catalogue: IT, 390x844',flush=True)
            # Every volumetric family uses the same bounded preview pool and modal renderer.
            page.locator('.footer a[href="geometrie.html"]').click()
            expect(page.locator('body')).to_have_attribute('data-page','geometrie.html')
            for model in ['markov-network','program-flow','decision-surface','entropy-trace','gyroid','schwarz-p','schwarz-d','vibrational-mode','schwarz-network','bloch-sphere','interference','quantum-circuit','lattice','stochastic-paths','gaussian-density','covariance','sierpinski','menger','mobius','helicoid','catenoid','torus']:
                print(f'  Geometry: {model}',flush=True)
                card=page.locator(f'[data-geometry-open="{model}"]')
                card.scroll_into_view_if_needed()
                expect(card).to_have_attribute('data-geometry-motion','running',timeout=10000)
                assert page.locator('[data-geometry-ambient] canvas').count()<=3
                card.click();expect(page.locator('#geometry-dialog')).to_be_visible()
                assert page.locator('#geometry-dialog').evaluate('(dialog)=>dialog.scrollTop')==0
                expect_geometry_motion(page,dialog,reduced=False)
                expect(dialog.locator('#geometry-stage canvas')).to_have_count(1)
                expect(dialog.locator('[data-geo-legend]:visible')).to_have_count(1)
                expect(dialog.locator('h2')).to_have_count(1)
                expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','true')
                dialog.locator('[data-geo-right]').click()
                expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','false')
                dialog.locator('[data-geo-close]').click()
            page.locator('[data-geometry-open="julia"]').click()
            expect_geometry_motion(page,dialog,reduced=False,auto=False)
            expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','false')
            dialog.locator('[data-geo-view="side"]').click()
            dialog.locator('[data-geo-view="front"]').click()
            expect(dialog.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','false')
            dialog.locator('[data-geo-close]').click()
            page.locator('[data-geometry-open="schwarzite-neck"]').click()
            expect_geometry_motion(page,dialog,reduced=False)
            for preset in ['schwarzite-sections','schwarzite-lattice','schwarzite-neck']:
                select_geometry_preset(page,dialog,preset)
            dialog.locator('[data-geo-style]').select_option('wire')
            expect(dialog.locator('.geometry-legend')).to_be_hidden()
            expect(dialog.locator('[data-geo-style-help]')).to_contain_text('suddivisione grafica')
            dialog.locator('[data-geo-style]').select_option('surface')
            expect(dialog.locator('[data-geo-legend]:visible')).to_have_count(1)
            dialog.locator('[data-geo-close]').click()
            assert not errors,errors
            context.close()
        except Exception:
            if page is not None and not page.is_closed():
                report_failure(page)
            raise
        finally:
            browser.close()
finally:
    server.shutdown()
    server.server_close()
print('Entry, persistent music, navigation/history, carbon/security autoplay, motion preferences and cleanup passed.')
