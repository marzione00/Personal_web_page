"""CI browser smoke tests. Run against the built dist directory, never against production."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright, expect
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
                page.locator('[data-open-search]').click();page.locator('#dialog-search').fill('Bloch')
                expect(page.locator('#dialog-results .search-row').first).to_be_visible()
                page.keyboard.press('Escape');expect(page.locator('[data-open-search]')).to_be_focused()
                page.goto(url+prefix+'esperimenti.html')
                for slider in page.locator('input[type=range]').all():slider.focus();slider.press('ArrowRight')
                expect(page.locator('[data-experiment]')).to_have_count(3)
                page.locator('#decision-threshold').press('End')
                expect(page.locator('#decision [data-experiment-result]')).to_contain_text('Class 0' if prefix else 'Classe 0')
                page.goto(url+prefix+'geometrie.html')
                page.locator('[data-geometry-open]').first.click();expect(page.locator('#geometry-dialog')).to_be_visible()
                expect(page.locator('[data-geo-spin]')).to_have_attribute('aria-disabled','true')
                page.locator('[data-geo-close]').click()
                expect(page.locator('[data-geometry-open]').first).to_be_focused()
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
