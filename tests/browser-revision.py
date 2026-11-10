"""CI browser smoke tests. Run against the built dist directory, never against production."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from time import monotonic, sleep
from playwright.sync_api import sync_playwright, expect

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

root=Path(__file__).resolve().parents[1]
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root/'dist')))
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for width,height in [(1440,900),(390,844)]:
            context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
            page=context.new_page(); errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
            for prefix in ['', 'en/']:
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
                page.locator('[data-geometry-open]').first.click();expect(page.locator('#geometry-dialog')).to_be_visible()
                expect(page.locator('[data-geo-spin]')).to_have_attribute('aria-disabled','true')
                page.locator('[data-geo-close]').click()
                expect(page.locator('[data-geometry-open]').first).to_be_focused()
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
        browser.close()
finally:server.shutdown()
print('Desktop/mobile IT/EN search, experiments, reduced motion, focus, deep links and print passed.')

# Progressive routing must preserve the player and reinitialise page controls.
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root/'dist')))
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        context=browser.new_context(viewport={'width':390,'height':844})
        page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
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
        expect(page.locator('[data-geo-status]')).to_contain_text('Trascina')
        page.locator('[data-geo-close]').click()
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
        carbon.click();expect(page.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','true')
        phase=page.evaluate('MDCGeometryDebug.viewer.lightPhase')
        wait_for_light_change(page,phase)
        assert page.evaluate('!MDCGeometryDebug.viewer.gl || MDCGeometryDebug.viewer.gl.getError()===0')
        page.locator('[data-geo-right]').click()
        expect(page.locator('[data-geo-spin]')).to_have_attribute('aria-pressed','false')
        assert page.evaluate('MDCGeometryDebug.viewer.raf===0')
        page.locator('[data-geo-close]').click();expect(carbon).to_have_attribute('data-geometry-motion','running')
        page.emulate_media(reduced_motion='reduce');expect(carbon).to_have_attribute('data-geometry-motion','paused')
        page.emulate_media(reduced_motion='no-preference');expect(carbon).to_have_attribute('data-geometry-motion','running')
        page.locator('.hero').scroll_into_view_if_needed()
        expect(page.locator('[data-carbon-lattice] canvas')).to_have_count(0)
        page.locator('.hero .actions a[href="ricerca.html"]').click()
        expect(page.locator('body')).to_have_attribute('data-page','ricerca.html')
        bilayer=page.locator('[data-geometry-open="bilayer-nanoflake"]')
        bilayer.scroll_into_view_if_needed();expect(bilayer).to_have_attribute('data-geometry-motion','running')
        assert not errors,errors
        context.close();browser.close()
finally:server.shutdown()
print('Entry, persistent music, navigation/history, carbon autoplay, motion preferences and cleanup passed.')
