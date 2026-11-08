"""Local Chromium tests, including true WebGL under SwiftShader.
The environment blocks document navigation by policy. Test fixtures use set_content
with a virtual base URL and intercepted SAME PACKAGE resources. Only the test CSP
origin/base is adapted; production HTML and CSP hashes are validated separately.
This does not certify remote GitHub headers or field performance.
"""
from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import json,os,re,html as H,mimetypes,hashlib,base64,gzip
R=Path(__file__).resolve().parents[1];OUT=R/'reports';P=R/'anteprime';P.mkdir(exist_ok=True);OUT.mkdir(exist_ok=True)
checks=[];errors=[]
def check(name,truth,details=None):
 checks.append({'name':name,'pass':bool(truth),**({'details':details} if details is not None else {})})
 if not truth:print('FAIL',name,details,flush=True)
def fixture(name):
 s=(R/'dist'/name).read_text()
 def policy(m):
  c=H.unescape(m.group(1)).replace("'self'",'https://mdc.test').replace("base-uri 'none'",'base-uri https://mdc.test')
  return 'content="'+H.escape(c,quote=True)+'"'
 s=re.sub(r'content="(default-src [^"]+)"',policy,s)
 return s.replace('<head>','<head><base href="https://mdc.test/Personal_web_page/">')
def setup(page,requests,errs,fail_scene=False):
 def handler(route):
  requests.append(route.request.url);rel=unquote(urlparse(route.request.url).path).removeprefix('/Personal_web_page/');f=(R/'dist'/rel).resolve()
  if not f.is_relative_to((R/'dist').resolve()):route.abort();return
  if fail_scene and rel.endswith('.bin'):route.fulfill(status=404,headers={'Access-Control-Allow-Origin':'*'},body='Test missing model');return
  if f.is_file():route.fulfill(status=200,headers={'Access-Control-Allow-Origin':'*'},content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream',body=f.read_bytes())
  else:route.fulfill(status=404,body='Missing resource')
 page.route('https://mdc.test/**',handler);page.on('pageerror',lambda e:errs.append(str(e)));page.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
def load(page,name):page.set_content(fixture(name),wait_until='networkidle')
def decoded(page):
 page.evaluate('''async()=>{await Promise.all([...document.images].map(async i=>{if(!i.getAttribute('src'))return;i.loading='eager';try{await i.decode()}catch{}}))}''')
# normalize call helper for API version
live=lambda page:page.wait_for_function('()=>Boolean(window.MDCGeometryDebug?.viewer?.model && document.querySelector("#geometry-stage.is-live"))',timeout=10000)
files=sorted(p.name for p in (R/'dist').glob('*.html'))
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.getenv('CHROMIUM_BIN','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader'])
 if os.getenv('MDC_SKIP_LAYOUT')=='1':checks.extend(json.loads((OUT/'layout-checks.json').read_text()))
 for width in ([] if os.getenv('MDC_SKIP_LAYOUT')=='1' else [320,390,768,1440]):
  print('layout',width,flush=True)
  for name in files:
   page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');req=[];errs=[];setup(page,req,errs);load(page,name);decoded(page)
   check(f'{width}/{name}: H1',page.locator('main h1').count()==1)
   check(f'{width}/{name}: no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   check(f'{width}/{name}: all images decoded',page.locator('main img').evaluate_all('(xs)=>xs.every(i=>i.complete&&i.naturalWidth>0)'))
   check(f'{width}/{name}: no premature 3D download',not any('.bin' in x or 'viewer-' in x for x in req))
   check(f'{width}/{name}: no JS/CSP errors',not errs,errs[:2]);errors.extend(errs)
   if name=='index.html':
    vals=page.locator('.hero-portrait img').evaluate('''e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return{nw:e.naturalWidth,nh:e.naturalHeight,fit:s.objectFit,filter:s.filter,ratio:(r.width-2)/(r.height-2)}}''')
    check(f'{width}: original photograph aspect ratio',vals['nw']==1274 and vals['nh']==2048 and vals['fit']=='contain' and vals['filter']=='none' and abs(vals['ratio']-1274/2048)<.001,vals)
    if width<590:check(f'{width}: mobile actions before portrait',page.locator('.hero .actions').bounding_box()['y']<page.locator('.hero-portrait').bounding_box()['y'])
    q=page.locator('.epigraph-card blockquote').all_inner_texts();check(f'{width}: full epigraphs',len(q)==3 and 'immaterial source and explanation' in q[1] and 'most passionate years of his life' in q[2] and '[...]' not in ''.join(q))
   if width in [390,1440] and name in ['index.html','didattica.html','ricerca.html','geometrie.html','cv.html','blog.html','articolo-colpire-i-nervi-del-sistema.html','corso-quantum-post-quantum-computing-2026-2027.html']:
    stem={'index.html':'home','geometrie.html':'atlante','cv.html':'profilo','corso-quantum-post-quantum-computing-2026-2027.html':'quantum','articolo-colpire-i-nervi-del-sistema.html':'articolo'}.get(name,name[:-5]);suffix='mobile' if width==390 else 'desktop'
    page.screenshot(path=str(P/f'{stem}-{suffix}.png'))
    if name=='index.html':
     page.screenshot(path=str(P/f'home-{suffix}-completa.png'),full_page=True);page.locator('.home-fields').screenshot(path=str(P/f'aree-{suffix}.png'));page.locator('.epigraphs').screenshot(path=str(P/f'epigrafi-{suffix}.png'))
     page.locator('[data-reading]').click();check(f'{width}: light reading mode',page.locator('body').evaluate('e=>e.classList.contains("reading-mode")'));page.evaluate('scrollTo(0,0)');page.screenshot(path=str(P/f'home-{suffix}-chiara.png'))
   page.close()
 (OUT/'layout-checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
 # Hover: load only after deliberate intent; follow pointer; stop outside.
 page=browser.new_page(viewport={'width':1440,'height':1000});req=[];errs=[];setup(page,req,errs);load(page,'index.html');a=page.locator('[data-geometry-open="markov-network"]');a.hover();page.wait_for_function('()=>Boolean(window.MDCGeometryDebug?.viewer?.model)',timeout=10000)
 check('hover: single active canvas',page.locator('canvas.geometry-canvas').count()==1)
 check('hover: one renderer request',len([r for r in req if 'viewer-' in r])==1)
 check('hover: one requested model',len([r for r in req if r.endswith('.bin')])==1)
 rect=a.bounding_box();before=page.evaluate('MDCGeometryDebug.viewer.angle.slice()');page.mouse.move(rect['x']+rect['width']*.80,rect['y']+rect['height']*.65);page.wait_for_timeout(500)
 check('hover: orientation follows pointer',page.evaluate('MDCGeometryDebug.viewer.angle')!=before)
 page.mouse.move(10,10);page.wait_for_timeout(120);check('hover: scene detaches when pointer leaves',page.locator('canvas.geometry-canvas').count()==0 and page.evaluate('MDCGeometryDebug.viewer.raf===0'))
 # Modal with normal interaction.
 a.click();live(page);check('click: dialog opens',page.locator('#geometry-dialog').is_visible());check('click: single context reused',page.locator('canvas.geometry-canvas').count()==1)
 n=page.evaluate('MDCGeometryDebug.viewer.angle[1]');page.locator('[data-geo-right]').click();check('rotate button changes actual camera',abs(page.evaluate('MDCGeometryDebug.viewer.angle[1]')-n)>.1)
 z=page.evaluate('MDCGeometryDebug.viewer.zoom');page.locator('[data-geo-in]').click();check('zoom button changes projection',page.evaluate('MDCGeometryDebug.viewer.zoom')>z)
 page.locator('[data-geo-reset]').click();check('reset restores zoom',page.evaluate('MDCGeometryDebug.viewer.zoom')==1)
 stage=page.locator('#geometry-stage');stage.focus();a0=page.evaluate('MDCGeometryDebug.viewer.angle[0]');page.keyboard.press('ArrowDown');check('keyboard rotates',page.evaluate('MDCGeometryDebug.viewer.angle[0]')>a0)
 page.locator('[data-geo-spin]').click();page.wait_for_timeout(200);frames=page.evaluate('MDCGeometryDebug.viewer.frames');page.wait_for_timeout(200);check('autoplay animates only when requested',page.evaluate('MDCGeometryDebug.viewer.frames')>frames);page.locator('[data-geo-spin]').click();page.wait_for_timeout(80);check('pause stops RAF',page.evaluate('MDCGeometryDebug.viewer.raf')==0)
 check('modal displays formula',page.locator('#geometry-dialog [role=math]').count()==1)
 page.screenshot(path=str(P/'visualizzatore-grafo-desktop.png'))
 page.keyboard.press('Escape');check('Escape closes dialog and restores focus',not page.locator('#geometry-dialog').is_visible() and a.evaluate('(e)=>e===document.activeElement'))
 check('closed viewer has no active animation',page.evaluate('MDCGeometryDebug.viewer.raf===0'))
 errors.extend(errs);page.close()
 # Atlas: every binary actually decodes and draws. No copy of a static image counts as 3D.
 page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');req=[];errs=[];setup(page,req,errs);load(page,'geometrie.html')
 ids=json.loads((R/'public/geometry/manifest.json').read_text())
 for g in ids:
  page.locator(f'[data-geometry-open="{g["id"]}"]').click();live(page);page.wait_for_timeout(60)
  check('3D draw: '+g['id'],page.evaluate('MDCGeometryDebug.viewer.gl.getError()===0 && MDCGeometryDebug.viewer.model.ix.length>0'))
  check('descriptive formula: '+g['id'],page.locator('#geometry-dialog [role=math]').count()==1)
  check('bounded cache: '+g['id'],page.evaluate('MDCGeometryDebug.cacheSize')<=5)
  if g['id'] in ['gyroid','bloch-sphere','julia']:page.screenshot(path=str(P/f'visualizzatore-{g["id"]}-desktop.png'))
  page.keyboard.press('Escape');page.wait_for_function('()=>!document.querySelector("#geometry-dialog").open && !document.querySelector("#geometry-stage canvas")')
 check('atlas does not allocate multiple canvas contexts',page.locator('canvas.geometry-canvas').count()==0);errors.extend(errs);page.close()
 # Reduced motion blocks hover startup, not user-driven exploration.
 page=browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce');req=[];errs=[];setup(page,req,errs);load(page,'index.html');page.locator('[data-geometry-open="gyroid"]').hover();page.wait_for_timeout(500)
 check('reduced motion prevents hover download',not any('.bin' in r or 'viewer-' in r for r in req))
 page.locator('[data-geometry-open="gyroid"]').click();live(page);page.locator('[data-geo-spin]').click();check('reduced motion blocks autoplay',page.evaluate('!MDCGeometryDebug.viewer.auto'));errors.extend(errs);page.close()
 # Touch + small dialog.
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);req=[];errs=[];setup(page,req,errs);load(page,'corso-quantum-post-quantum-computing-2026-2027.html');page.locator('[data-geometry-open="bloch-sphere"]').tap();live(page)
 check('touch tap opens real model',page.locator('#geometry-dialog').is_visible());check('mobile dialog stays inside viewport',page.evaluate('document.documentElement.scrollWidth<=innerWidth'));page.screenshot(path=str(P/'visualizzatore-mobile.png'))
 st=page.locator('#geometry-stage');ang=page.evaluate('MDCGeometryDebug.viewer.angle.slice()');box=st.bounding_box();x=box['x']+box['width']*.45;y=box['y']+box['height']*.45
 cdp=page.context.new_cdp_session(page)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':0}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+48,'y':y+22,'id':0}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 check('mobile: real emulated touch drag changes camera',page.evaluate('MDCGeometryDebug.viewer.angle')!=ang)
 page.locator('[data-geo-right]').click();check('mobile accessible camera controls',page.evaluate('MDCGeometryDebug.viewer.angle')!=ang)
 errors.extend(errs);page.close()
 # WebGL unavailable: content and static image are retained.
 page=browser.new_page(viewport={'width':390,'height':844});req=[];errs=[];setup(page,req,errs);load(page,'index.html');page.evaluate("HTMLCanvasElement.prototype.getContext=function(){return null}");page.locator('[data-geometry-open="gyroid"]').click();page.wait_for_timeout(700)
 check('WebGL fallback preserves text',page.locator('#geometry-dialog .geometry-explanation').is_visible());check('WebGL fallback preserves preview',page.locator('[data-geo-fallback]').evaluate('(e)=>e.complete&&e.naturalWidth>0'));check('WebGL failure reported', 'non è disponibile' in page.locator('[data-geo-status]').inner_text());errors.extend(errs);page.close()
 # No JavaScript: content, formula details and normal links still exist.
 ctx=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});page=ctx.new_page();req=[];errs=[];setup(page,req,errs);load(page,'geometrie.html')
 check('no JS: all mathematical descriptions present',page.locator('.atlas-card details').count()==24);page.locator('.atlas-card details summary').first.click();check('no JS: details open natively',page.locator('.atlas-card details').first.get_attribute('open') is not None);ctx.close()
 # Offline monofile contains exact image and PDF bytes and an embedded scene fallback.
 page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');offline=(R/'MDC_LAB_anteprima.html').read_text();page.set_content(offline,wait_until='load');page.locator('[data-view="index.html"] [data-geometry-open="gyroid"]').click();live(page)
 check('offline preview has working 3D without a server',page.locator('canvas.geometry-canvas').count()==1 and page.locator('#geometry-dialog [role=math]').count()==1);page.keyboard.press('Escape');page.evaluate('location.hash="/geometrie.html"');page.wait_for_timeout(100);check('offline atlas navigation',page.locator('[data-view="geometrie.html"]').is_visible());page.close()
 browser.close()
check('no runtime errors in normal paths',not errors,errors[:8])
report={'version':'2.3','method':'Chromium, SwiftShader WebGL, virtual subdirectory origin and intercepted package resources. Test-only CSP origin/base adapted. Production CSP hashes validated separately; not a deployment or mobile-device GPU certification.','passed':sum(c['pass'] for c in checks),'failed':sum(not c['pass'] for c in checks),'checks':checks}
(OUT/'browser-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},indent=2))
raise SystemExit(bool(report['failed']))
