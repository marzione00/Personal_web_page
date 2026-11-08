"""Local bilingual checks; intercepted fixture origin, no remote deployment.
For storage checks only, localStorage is simulated because about:blank is opaque.
"""
from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import os,re,html,mimetypes,json
R=Path(__file__).resolve().parents[1];O=R/'reports';P=R/'anteprime';O.mkdir(exist_ok=True);P.mkdir(exist_ok=True)
checks=[]
checkpoint=O/'i18n-layout-progress.json'
if os.getenv('RESUME')=='1' and checkpoint.exists():checks=json.loads(checkpoint.read_text())
completed={x['name'] for x in checks}
def check(name,truth,detail=None):
 checks.append({'name':name,'pass':bool(truth),'detail':detail})
 if not truth:print('FAIL',name,detail,flush=True)
def fixture(name,offline=False):
 s=(R/name if offline else R/'dist'/name).read_text()
 def pol(m):return 'content="'+html.escape(html.unescape(m.group(1)).replace("'self'",'https://mdc.test').replace("base-uri 'none'",'base-uri https://mdc.test'),quote=True)+'"'
 s=re.sub(r'content="(default-src [^"]+)"',pol,s)
 return s.replace('<head>','<head><base href="https://mdc.test/Personal_web_page/'+('en/' if not offline and name.startswith('en/') else '')+'">')
def setup(page,req,err):
 def route(x):
  req.append(x.request.url);f=(R/'dist'/unquote(urlparse(x.request.url).path).removeprefix('/Personal_web_page/')).resolve()
  if not f.is_relative_to((R/'dist').resolve()):x.abort();return
  if f.is_file():x.fulfill(body=f.read_bytes(),headers={'Access-Control-Allow-Origin':'*'},content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
  else:x.fulfill(status=404,body='Missing')
 page.route('https://mdc.test/**',route);page.on('pageerror',lambda e:err.append(str(e)));page.on('console',lambda m:err.append(m.text) if m.type=='error' else None)
def decode(p):p.evaluate('''async()=>{await Promise.all([...document.images].map(async i=>{if(!i.getAttribute('src'))return;i.loading='eager';try{await i.decode()}catch{}}))}''')
def live(p):p.wait_for_function('()=>Boolean(window.MDCGeometryDebug?.viewer?.model && document.querySelector("#geometry-stage.is-live"))',timeout=10000)
files=sorted(f.relative_to(R/'dist').as_posix() for f in (R/'dist').rglob('*.html'))
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=False,args=['--no-sandbox','--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
 for width in [320,390,768,1440]:
  print('Layout',width,flush=True)
  for name in files:
   if f'{width}/{name} errors' in completed:continue
   p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');req=[];err=[];setup(p,req,err);p.set_content(fixture(name),wait_until='load');decode(p)
   lang='en' if name.startswith('en/') else 'it';key=f'{width}/{name}'
   check(key+' language',p.locator('html').get_attribute('lang')==lang)
   check(key+' H1',p.locator('main h1').count()==1)
   check(key+' overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   check(key+' images',p.locator('main img').evaluate_all('(xs)=>xs.every(i=>i.complete&&i.naturalWidth>0)'))
   check(key+' lazy 3D',not any('.bin' in u or 'viewer-' in u for u in req))
   check(key+' controls',p.locator('.language-switch').is_visible() and p.locator('[data-reading]').is_visible())
   check(key+' errors',not err,err[:2])
   if name.endswith('index.html'):
    q=p.locator('.epigraph-card blockquote').all_inner_texts();check(key+' full quotations',len(q)==3 and 'immaterial source and explanation' in q[1] and 'most passionate years of his life' in q[2])
    v=p.locator('.hero-portrait img').evaluate('''e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return{w:e.naturalWidth,h:e.naturalHeight,fit:s.objectFit,filter:s.filter,ratio:(r.width-2)/(r.height-2)}}''')
    check(key+' original photo',v['w']==1274 and v['h']==2048 and v['fit']=='contain' and v['filter']=='none' and abs(v['ratio']-1274/2048)<.001)
   selected={'en/index.html':'homepage-en','index.html':'homepage-it','en/didattica.html':'teaching-en','en/ricerca.html':'research-en','en/cv.html':'profile-en','en/blog.html':'blog-en','en/articolo-colpire-i-nervi-del-sistema.html':'article-en','en/corso-quantum-post-quantum-computing-2026-2027.html':'quantum-en'}
   if width in [390,1440] and name in selected:
    suf='mobile' if width==390 else 'desktop';p.screenshot(path=str(P/f'{selected[name]}-{suf}.png'))
    if name=='en/index.html':
     p.screenshot(path=str(P/f'homepage-en-{suf}-complete.png'),full_page=True);p.locator('[data-reading]').click();check(key+' theme',p.locator('body').evaluate('e=>e.classList.contains("reading-mode")'));p.screenshot(path=str(P/f'homepage-en-{suf}-light.png'))
   p.close();checkpoint.write_text(json.dumps(checks,ensure_ascii=False,indent=2))
 (O/'i18n-layout.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
 p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');req=[];err=[];setup(p,req,err);p.set_content(fixture('en/geometrie.html'),wait_until='load')
 for g in json.loads((R/'public/geometry/manifest.json').read_text()):
  p.locator(f'[data-geometry-open="{g["id"]}"]').click();live(p)
  check('EN model '+g['id'],p.evaluate('MDCGeometryDebug.viewer.gl.getError()===0 && MDCGeometryDebug.viewer.model.ix.length>0'))
  check('EN formula '+g['id'],'Formula or construction' in p.locator('#geometry-dialog').inner_text())
  check('EN status '+g['id'],p.locator('[data-geo-status]').inner_text().startswith('Drag to explore'))
  if g['id']=='gyroid':p.screenshot(path=str(P/'viewer-gyroid-en-desktop.png'))
  p.keyboard.press('Escape');p.wait_for_function('()=>!document.querySelector("#geometry-dialog").open')
 check('shared viewer fetched once',len([x for x in req if 'viewer-' in x])==1)
 check('EN viewer errors',not err,err);p.close()
 p=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);req=[];err=[];setup(p,req,err);p.set_content(fixture('en/corso-quantum-post-quantum-computing-2026-2027.html'),wait_until='load')
 p.locator('[data-menu]').tap();check('mobile EN menu',p.locator('#primary-nav').is_visible() and 'Teaching' in p.locator('#primary-nav').inner_text());p.locator('[data-menu]').tap()
 p.locator('[data-open-search]').tap();p.locator('#dialog-search').fill('quantum');check('EN search result count',bool(re.search(r'\d+ results?',p.locator('#search-dialog [data-count]').inner_text())));p.locator('[data-close-search]').tap()
 p.locator('[data-geometry-open="bloch-sphere"]').tap();live(p);angle=p.evaluate('MDCGeometryDebug.viewer.angle[1]');p.locator('[data-geo-right]').tap();check('EN touch rotate',p.evaluate('MDCGeometryDebug.viewer.angle[1]')!=angle);check('EN touch no overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'));p.screenshot(path=str(P/'viewer-bloch-en-mobile.png'));p.close()
 for lang in ['it','en']:
  target='en' if lang=='it' else 'it';name=('en/' if lang=='en' else '')+'cv.html';p=b.new_page();req=[];err=[];setup(p,req,err)
  p.evaluate('''()=>{window.testStore={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>testStore[k]??null,setItem:(k,v)=>testStore[k]=String(v)}})}''')
  p.set_content(fixture(name),wait_until='load');p.evaluate('location.hash="interessi-personali"')
  p.evaluate('''()=>document.addEventListener('click',e=>{let a=e.target.closest('[data-language]');if(a){window.chosenLanguageURL=a.href;e.preventDefault();}})''')
  p.locator(f'[data-language="{target}"]').click();expected='https://mdc.test/Personal_web_page/'+('en/' if target=='en' else '')+'cv.html#interessi-personali'
  check(lang+' switch page and anchor',p.evaluate('chosenLanguageURL')==expected,p.evaluate('chosenLanguageURL'))
  check(lang+' store preference',p.evaluate('testStore["mdc-language"]')==target)
  p.locator('[data-reading]').click();check(lang+' theme stored',p.evaluate('typeof testStore["mdc-reading"]==="string"'));p.close()
 p=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');req=[];err=[];setup(p,req,err);p.set_content(fixture('MANIFOLD_preview_EN.html',True),wait_until='load');decode(p)
 check('offline lang',p.locator('html').get_attribute('lang')=='en')
 p.locator('#primary-nav a[href="cv.html"]').click();p.wait_for_function('()=>!document.querySelector(\'[data-view="cv.html"]\').hidden')
 check('offline EN profile',p.locator('[data-view="cv.html"] h1').inner_text().startswith('Profile'))
 p.evaluate('''()=>document.addEventListener('click',e=>{let a=e.target.closest('[data-language]');if(a){window.chosenLanguageURL=a.href;e.preventDefault();}})''')
 p.locator('[data-language="it"]').click();check('offline matching IT page',p.evaluate('chosenLanguageURL').endswith('MANIFOLD_anteprima.html#/cv.html'))
 p.locator('#primary-nav a[href="index.html"]').click();p.locator('[data-view="index.html"] [data-geometry-open="gyroid"]').click();live(p)
 check('offline model without requests',not any('.bin' in x or 'viewer-' in x for x in req));check('offline no errors',not err,err[:3]);p.close()
 ctx=b.new_context(java_script_enabled=False);p=ctx.new_page();req=[];err=[];setup(p,req,err);p.set_content(fixture('en/index.html'),wait_until='load');check('noJS English and switch',p.locator('h1').count()==1 and p.locator('[data-language="it"]').get_attribute('href')=='../index.html');ctx.close();b.close()
failed=[x for x in checks if not x['pass']]
(O/'i18n-browser-checks.json').write_text(json.dumps({'total':len(checks),'passed':len(checks)-len(failed),'failed':failed,'checks':checks},ensure_ascii=False,indent=2));print('TOTAL',len(checks),'PASS',len(checks)-len(failed),'FAIL',len(failed),flush=True)
raise SystemExit(1 if failed else 0)
