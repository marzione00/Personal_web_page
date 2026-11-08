"""Render the delivered self-contained HTML in Chromium; no external image generation.
Navigation to HTTP/file URLs is restricted in the delivery environment, so HTML
is loaded with set_content. Images/PDFs use the exact bytes embedded by build.mjs.
Tests cover local browser behaviour, not deployed hosting or CMS authentication.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import hashlib,base64,json,os,re
ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/'reports'; PREVIEW=ROOT/'anteprime';PREVIEW.mkdir(exist_ok=True)
html=(ROOT/'MDC_LAB_anteprima.html').read_text()
manifest=json.loads((ROOT/'content/photo-manifest.json').read_text())
geometry=json.loads((ROOT/'public/geometry/manifest.json').read_text())
checks=[];errors=[]
def check(name,condition,detail=None):
 checks.append({'name':name,'pass':bool(condition),**({'detail':detail} if detail is not None else {})})
 if not condition:print('FAIL',name,detail)
# An embedded original must not have been replaced by an image from a previous preview.
soup=BeautifulSoup(html,'html.parser')
for m in manifest:
 imgs=soup.find_all('img',attrs={'data-original-src':m['path']})
 check('Embedded photo exists: '+m['id'],len(imgs)>0)
 for img in imgs:
  raw=base64.b64decode(img['src'].split(',',1)[1]);check('Embedded photo exact SHA256: '+m['id'],hashlib.sha256(raw).hexdigest()==m['sha256'])
for g in geometry:
 check('Text-free graphic packaged: '+g['id'],(ROOT/'public/geometry'/g['file']).is_file())
start=html.index('(() => {const files=')+len('(() => {const files=')
end=html.index(',urls=new Map()',start)
pdfs_embedded=json.loads(html[start:end])
for ref,entry in pdfs_embedded.items():
 expected=(ROOT/'public'/ref).read_bytes()
 actual=base64.b64decode(entry['base64'])
 check('Exact embedded PDF SHA256: '+ref,hashlib.sha256(actual).digest()==hashlib.sha256(expected).digest())

files=[p.name for p in sorted((ROOT/'dist').glob('*.html'))]
forbidden=re.compile(r'motivo geometrico|figure geometriche|FIG\. 01|STRUTTURE / CONNESSIONI|TRAME / GEOMETRIE|VISUALIZZAZIONE ASTRATTA|FOTOGRAFIA\s+DA INSERIRE|__MDC_IN_ATTESA_SOURCE__',re.I)

def show(page,file):
 page.evaluate('(f)=>{location.hash="/"+f}',file)
 page.wait_for_function('(f)=>!document.querySelector(`[data-view="${f}"]`).hidden',arg=file,timeout=5000)
 page.evaluate('window.scrollTo(0,0)')
 page.evaluate('''async()=>{const v=document.querySelector('[data-view]:not([hidden])');await Promise.all([...v.querySelectorAll('img')].map(async i=>{i.loading='eager';try{await i.decode()}catch(e){}}))}''')

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_BIN','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 for width in [320,390,768,1440]:
  print('Checking width',width,flush=True)
  page=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce')
  page.set_default_timeout(5000)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.set_content(html,wait_until='load',timeout=20000)
  for file in files:
   show(page,file)
   view=page.locator(f'[data-view="{file}"]')
   check(f'{width}/{file}: single visible H1',page.locator('main h1:visible').count()==1)
   check(f'{width}/{file}: no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   check(f'{width}/{file}: local images decoded',view.locator('img').evaluate_all('(xs)=>xs.every(x=>x.complete&&x.naturalWidth>0)'))
   check(f'{width}/{file}: no obsolete visible labels',not forbidden.search(view.inner_text()))
   check(f'{width}/{file}: decorative figures have no visible words',view.locator('.geometry').evaluate_all('(xs)=>xs.every(x=>x.textContent.trim()===""&&x.getAttribute("aria-hidden")==="true")'))
  show(page,'index.html')
  photo=page.locator('.hero-portrait img')
  values=photo.evaluate('''e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {w:e.naturalWidth,h:e.naturalHeight,filter:s.filter,fit:s.objectFit,opacity:s.opacity,ratio:(r.width-parseFloat(s.borderLeftWidth)-parseFloat(s.borderRightWidth))/(r.height-parseFloat(s.borderTopWidth)-parseFloat(s.borderBottomWidth))}}''')
  check(f'{width}: original portrait visible and uncropped',photo.is_visible() and values['w']==1274 and values['h']==2048 and values['filter']=='none' and values['fit']=='contain' and abs(values['ratio']-1274/2048)<.001,values)
  check(f'{width}: four distinct hero-ribbon figures',page.locator('.geometry-ribbon .geometry').count()==4)
  # Save actual screenshots from this exact build. Full and useful viewport versions.
  if width in [390,1440]:
   suffix='mobile' if width==390 else 'desktop'
   pages_to_capture={'index.html':'home','didattica.html':'didattica','ricerca.html':'ricerca','blog.html':'blog','cv.html':'profilo','contatti.html':'contatti','corso-quantum-post-quantum-computing-2026-2027.html':'quantum'}
   for file,stem in pages_to_capture.items():
    show(page,file);page.screenshot(path=str(PREVIEW/f'{stem}-{suffix}.png'),full_page=False)
    if file in ['index.html','cv.html']:page.screenshot(path=str(PREVIEW/f'{stem}-{suffix}-completa.png'),full_page=True)
   show(page,'index.html');page.locator('.geometry-ribbon').screenshot(path=str(PREVIEW/f'geometrie-{suffix}.png'))
   show(page,'cv.html');page.locator('.personal-gallery').scroll_into_view_if_needed();page.screenshot(path=str(PREVIEW/f'fotografie-{suffix}.png'))
   show(page,'ricerca.html');page.locator('#bibliografia').scroll_into_view_if_needed();page.screenshot(path=str(PREVIEW/f'pubblicazioni-{suffix}.png'))
  show(page,'didattica.html')
  panel=page.locator('[data-view="didattica.html"] [data-filter-panel]');items=page.locator('#courses [data-item]:visible')
  panel.locator('select').first.select_option(label='Cattolica');check(f'{width}: teaching filter',items.count()==3)
  panel.locator('[data-reset]').click();check(f'{width}: teaching reset',items.count()==6)
  show(page,'ricerca.html');panel=page.locator('[data-view="ricerca.html"] [data-filter-panel]');panel.locator('input').fill('ransomware')
  check(f'{width}: research filter',page.locator('#publications [data-item]:visible').count()==2)
  panel.locator('[data-reset]').click()
  page.keyboard.press('Control+k');check(f'{width}: keyboard search',page.locator('#search-dialog').is_visible())
  page.locator('#dialog-search').fill('quantum');check(f'{width}: search results',page.locator('#dialog-results [data-item]:visible').count()>0)
  page.keyboard.press('Escape');check(f'{width}: escape closes search',not page.locator('#search-dialog').is_visible())
  show(page,'index.html');page.locator('[data-reading]').click();check(f'{width}: reading mode toggle',page.locator('body').evaluate('e=>e.classList.contains("reading-mode")'))
  check(f'{width}: light mode keeps original photo',photo.evaluate('e=>getComputedStyle(e).filter==="none"'))
  if width==1440:page.screenshot(path=str(PREVIEW/'home-desktop-chiara.png'),full_page=False)
  page.locator('[data-reading]').click()
  if width<821:
   page.locator('[data-menu]').click();check(f'{width}: mobile menu opens',page.locator('#primary-nav').is_visible());page.keyboard.press('Escape')
  show(page,'corso-quantum-post-quantum-computing-2026-2027.html')
  pdfs=page.locator('[data-view="corso-quantum-post-quantum-computing-2026-2027.html"] a[download]')
  check(f'{width}: seven working embedded PDF URLs',pdfs.count()==7 and pdfs.evaluate_all('(xs)=>xs.every(x=>x.href.startsWith("blob:"))'))
  print('Completed width',width,flush=True)
  page.close()
 browser.close()
check('No application JavaScript/CSP errors during normal navigation',not errors,errors[:6])
report={'version':json.loads((ROOT/'content/site.json').read_text())['version'],'method':'Chromium / Playwright; actual self-contained HTML via set_content; all images and PDFs decoded from supplied bytes; not a live-hosting test','passed':sum(c['pass'] for c in checks),'failed':sum(not c['pass'] for c in checks),'errors':errors,'checks':checks}
(REPORT/'visual-browser-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},ensure_ascii=False,indent=2))
raise SystemExit(bool(report['failed']))
