"""Run with xvfb-run -a -s '-screen 0 2560x1440x24' python3 tests/browser-ambient-webgl.py.
Uses a fresh software-WebGL process so GPU state does not contaminate layout measurements.
"""
from ambient_browser_fixture import *
checks=[]
def check(name,ok):checks.append({'name':name,'passed':bool(ok)})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-accelerated-2d-canvas'])
 page=b.new_page(viewport={'width':1440,'height':950});errors,req=setup(page)
 a=page.locator('[data-geometry-open="markov-network"]');a.hover();page.wait_for_function('()=>Boolean(window.MDCGeometryDebug?.viewer?.model)',timeout=10000)
 check('ambient 2D and WebGL both exist',page.locator('canvas.geometry-canvas').count()==1 and page.locator('canvas.matrix-ambient').count()==1)
 a.click();page.wait_for_timeout(250);check('3D modal pauses ambient',not page.evaluate('MDCMatrixDebug.active'))
 angle=page.evaluate('MDCGeometryDebug.viewer.angle[1]');page.locator('[data-geo-right]').click();check('3D rotation controls remain effective',page.evaluate('MDCGeometryDebug.viewer.angle[1]')!=angle)
 check('WebGL rendered model without GL error',page.evaluate('MDCGeometryDebug.viewer.gl.getError()===0'))
 page.keyboard.press('Escape');page.wait_for_timeout(120);check('closing 3D resumes ambient',page.evaluate('MDCMatrixDebug.active'))
 check('no runtime errors',not errors);b.close()
report={'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks),'checks':checks,'method':'Fresh Chromium + Xvfb + SwiftShader. 2D acceleration disabled in the test process only.'}
(R/'reports/browser-ambient-webgl.json').write_text(json.dumps(report,indent=2)+'\n');print(report)
raise SystemExit(bool(report['failed']))
