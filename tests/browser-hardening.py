"""Local regression tests with virtual-origin routing; not a live deployment test.
A test-only SHA-256 bridge is required because policy blocks secure document navigation.
Production CSP hashes are verified separately by check-output.mjs.
"""
from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import re,html,json,mimetypes,hashlib,os
R=Path(__file__).resolve().parents[1];O=R/'reports';P=R/'anteprime';O.mkdir(exist_ok=True);P.mkdir(exist_ok=True)
checks=[]
def check(name,value,details=None):
 checks.append({'name':name,'pass':bool(value),'details':details})
 if not value: print('FAIL',name,details,flush=True)
def fixture(file):
 s=(R/'dist'/file).read_text();base='https://mdc.test/Personal_web_page/'+('en/' if file.startswith('en/') else '')
 def csp(m):
  c=html.unescape(m[1]).replace("'self'",'https://mdc.test').replace("base-uri 'none'",'base-uri https://mdc.test')
  return 'content="'+html.escape(c,quote=True)+'"'
 s=re.sub(r'content="(default-src [^"]+)"',csp,s)
 return s.replace('<head>',f'<head><base href="{base}">')
def setup(page,errors,mode='normal',crypto=False):
 def handler(route):
  rel=unquote(urlparse(route.request.url).path).removeprefix('/Personal_web_page/');p=(R/'dist'/rel).resolve()
  if not p.is_relative_to((R/'dist').resolve()):route.abort();return
  if p.is_file():
   b=p.read_bytes()
   if rel.endswith('.bin') and mode=='tamper':b=b[:-1]+bytes([b[-1]^1])
   if rel.endswith('.bin') and mode=='oversize':b=b'X'*300001
   route.fulfill(status=200,headers={'Access-Control-Allow-Origin':'*'},content_type=mimetypes.guess_type(str(p))[0] or 'application/octet-stream',body=b)
  else: route.fulfill(status=404,body='Not found')
 page.route('https://mdc.test/**',handler);page.on('pageerror',lambda e:errors.append(str(e)))
 if crypto:
  page.expose_function('__testDigest',lambda arr:list(hashlib.sha256(bytes(arr)).digest()))
  page.evaluate("""()=>{Object.defineProperty(crypto,'subtle',{configurable:true,value:{digest:async(name,buffer)=>{if(name!=='SHA-256')throw Error('Unsupported test digest');return new Uint8Array(await window.__testDigest(Array.from(new Uint8Array(buffer)))).buffer;}}});}""")
files=sorted(str(p.relative_to(R/'dist')) for p in (R/'dist').rglob('*.html'))
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.getenv('CHROMIUM_BIN','/usr/bin/chromium'),headless=False,args=['--no-sandbox','--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-accelerated-2d-canvas'])
 for w in [390,1440]:
  print('layout',w,flush=True)
  for f in files:
   page=browser.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');errs=[];setup(page,errs);page.set_content(fixture(f),wait_until='load');page.evaluate('''async()=>{await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode()}catch{}}));}''')
   check(f'{w}/{f}: heading',page.locator('main h1').count()==1)
   check(f'{w}/{f}: width',page.evaluate('()=>document.documentElement.scrollWidth<=innerWidth'))
   check(f'{w}/{f}: image decode',page.locator('main img').evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)'))
   check(f'{w}/{f}: runtime',not errs,errs)
   check(f'{w}/{f}: no early 3D',page.locator('canvas.geometry-canvas').count()==0)
   if f.endswith('articolo-colpire-i-nervi-del-sistema.html'):
    lang='en' if f.startswith('en/') else 'it';text=page.locator('main').inner_text();check(f'{w}/{f}: revised opening',('Cosmo describes a war' if lang=='en' else 'Cosmo parla di una guerra') in text);check(f'{w}/{f}: stale opening absent','The line foregrounds' not in text and 'La battuta porta in primo piano' not in text);page.screenshot(path=str(P/f'article-{lang}-{w}.png'))
   if f=='index.html' and w==1440:page.locator('.epigraphs').screenshot(path=str(P/'citazioni-nuovo-titolo.png'))
   if f.endswith('cv.html'):check(f'{w}/{f}: download',page.locator('a[download="Marzio_De_Corato_CV.pdf"]').count()==1)
   page.close()
 # CSP probes use DOM API without eval in the delivered application.
 page=browser.new_page();errs=[];setup(page,errs);page.set_content(fixture('index.html'),wait_until='load')
 page.evaluate('''()=>{window.__probe=0;const s=document.createElement('script');s.textContent='window.__probe=1';document.body.append(s);const b=document.createElement('button');b.setAttribute('onclick','window.__probe=2');document.body.append(b);b.click();const x=document.createElement('script');x.src='https://mdc.test/Personal_web_page/evil.js';document.body.append(x);}''');page.wait_for_timeout(100);check('unapproved inline and event handler blocked',page.evaluate('()=>window.__probe')==0);page.close()
 for mode in ['normal','tamper','oversize']:
  page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errs=[];setup(page,errs,mode,crypto=True);page.set_content(fixture('index.html'),wait_until='load');page.locator('[data-geometry-open="gyroid"]').click()
  if mode=='normal':
   try:page.wait_for_function('()=>Boolean(window.MDCGeometryDebug?.viewer?.model&&document.querySelector("#geometry-stage.is-live"))',timeout=12000);ok=True
   except Exception:ok=False
   check('verified model renders with hash-authorised external renderer',ok,errs)
  else:
   page.wait_for_timeout(1800);check(mode+': no live model',page.locator('#geometry-stage.is-live').count()==0);check(mode+': explanation retained',page.locator('#geometry-dialog .geometry-explanation').is_visible())
  check(mode+': no unhandled exception',not errs,errs);page.close()
 browser.close()
report={'version':json.loads((R/'content/site.json').read_text())['version'],'passed':sum(x['pass'] for x in checks),'failed':sum(not x['pass'] for x in checks),'scope':'Local Chromium/SwiftShader virtual-origin fixtures; CV links exercised with a substitute PDF ONLY in an isolated test copy; this is not the author’s CV and is not distributed. Test-only SHA256 bridge supplies crypto.subtle on opaque fixture origin. Not a hosting/account audit.','checks':checks}
(O/'browser-hardening.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(report['passed'],report['failed'],flush=True);raise SystemExit(bool(report['failed']))
