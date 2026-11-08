#!/usr/bin/env python3
"""Playwright visual checks for travel pages and one temporary two-photo diary.
Never writes synthetic entries to the released project.
"""
from pathlib import Path
import os, json, shutil, tempfile, subprocess, re, html, mimetypes
from urllib.parse import urlparse, unquote
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/'reports'/'v2.6'
REPORT.mkdir(parents=True,exist_ok=True)
def setup(page,dist):
 def handler(route):
  rel=unquote(urlparse(route.request.url).path).removeprefix('/Personal_web_page/')
  dest=(dist/rel).resolve()
  if not dest.is_relative_to(dist.resolve()):route.abort();return
  if dest.is_file():route.fulfill(status=200,content_type=mimetypes.guess_type(str(dest))[0] or 'application/octet-stream',headers={'Access-Control-Allow-Origin':'*'},body=dest.read_bytes())
  else:route.fulfill(status=404,body='Missing test fixture')
 page.route('https://mdc.test/**',handler)
def load(page,dist,filename):
 raw=(dist/filename).read_text()
 def adjust(match):
  c=html.unescape(match.group(1)).replace("'self'",'https://mdc.test').replace("base-uri 'none'",'base-uri https://mdc.test')
  return 'content="'+html.escape(c,quote=True)+'"'
 raw=re.sub(r'content="(default-src [^"]+)"',adjust,raw)
 base='https://mdc.test/Personal_web_page/'+('en/' if filename.startswith('en/') else '')
 raw=raw.replace('<head>','<head><base href="'+base+'">',1)
 page.set_content(raw,wait_until='networkidle')

screenshot_files=[]
checks=[]
with sync_playwright() as engine:
 browser=engine.chromium.launch(executable_path=os.getenv('CHROMIUM_BIN','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 # The deliverable has no invented trips. Check its honest empty state and the main navigation.
 for lang in ('it','en'):
  for width,height in [(1440,900),(390,844),(320,740)]:
   page=browser.new_page(viewport={'width':width,'height':height},locale='en-GB' if lang=='en' else 'it-IT')
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   setup(page,ROOT/'dist');load(page,ROOT/'dist',('en/' if lang=='en' else '')+'viaggi.html')
   page.wait_for_timeout(350)
   assert page.locator('h1').count()==1
   assert page.locator('article.travel-card').count()==0
   assert (page.locator('body').inner_text().find('Non ci sono ancora diari')!=-1 if lang=='it' else page.locator('body').inner_text().find('No travel diaries')!=-1)
   assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+2')
   assert not errors,errors
   if width==1440:
    dest=REPORT/f'viaggi-{lang}-desktop.png';page.screenshot(path=str(dest),full_page=True);screenshot_files.append(str(dest))
   elif width==390:
    dest=REPORT/f'viaggi-{lang}-mobile.png';page.screenshot(path=str(dest),full_page=True);screenshot_files.append(str(dest))
   checks.append(f'{lang} empty travel archive {width}')
   page.close()
 page=browser.new_page(viewport={'width':1440,'height':900})
 setup(page,ROOT/'dist');load(page,ROOT/'dist','index.html')
 assert page.locator('a[href="viaggi.html"]').count()>=1
 assert page.locator('.home-travel').count()==1
 page.locator('.home-travel').screenshot(path=str(REPORT/'homepage-viaggi-cta.png'))
 checks.append('IT homepage travel CTA')
 page.close()
 # Build temporary published album with two untouched copies of existing user-provided images.
 with tempfile.TemporaryDirectory(prefix='mdc-travel-browser-') as td:
  dest=Path(td)/'mdc'
  shutil.copytree(ROOT,dest,ignore=shutil.ignore_patterns('dist','preview','reports','anteprime','node_modules','Topological_Manifolds_anteprima.html','Topological_Manifolds_preview_EN.html'))
  image_dir=dest/'public/media/images/viaggi/escursione-esempio'
  image_dir.mkdir(parents=True,exist_ok=True)
  shutil.copyfile(dest/'public/media/images/yoga-in-vetta.jpg',image_dir/'foto-01.jpg')
  shutil.copyfile(dest/'public/media/images/arrampicata-parete.jpg',image_dir/'foto-02.jpg')
  base='''---\ntitle: Verifica archivio di viaggio\ndate: 2026-11-07\nkind: Escursione\nplace: Luogo di test\nexcerpt: Un esempio tecnico, presente soltanto durante il collaudo.\ndraft: false\n---\n\nQuesto racconto temporaneo verifica il caricamento di un album con due fotografie originali.\n\n## Il percorso\n\nUna seconda sezione narrativa.\n\n## Album\n\n![Fotografia di verifica uno](media/images/viaggi/escursione-esempio/foto-01.jpg)\n![Fotografia di verifica due](media/images/viaggi/escursione-esempio/foto-02.jpg)\n'''
  translated=base.replace('Verifica archivio di viaggio','Travel archive validation').replace('Escursione','Hike').replace('Luogo di test','Test location').replace('Un esempio tecnico, presente soltanto durante il collaudo.','A temporary example used only for verification.').replace('Questo racconto temporaneo verifica il caricamento di un album con due fotografie originali.','A temporary diary verifies that two original pictures can be opened.').replace('Il percorso','The route').replace('Una seconda sezione narrativa.','Another short section.').replace('Fotografia di verifica uno','Original picture one').replace('Fotografia di verifica due','Original picture two')
  (dest/'content/markdown/viaggi/escursione-esempio.md').write_text(base,encoding='utf-8')
  (dest/'content/markdown/en/viaggi/escursione-esempio.md').write_text(translated,encoding='utf-8')
  proc=subprocess.run(['npm','run','build'],cwd=dest,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,timeout=120)
  assert proc.returncode==0,proc.stdout[-2000:]
  for lang in ('it','en'):
   page=browser.new_page(viewport={'width':390 if lang=='en' else 1440,'height':840})
   setup(page,dest/'dist')
   load(page,dest/'dist',('en/' if lang=='en' else '')+'viaggi.html')
   assert page.locator('article.travel-card').count()==1
   assert page.locator('article.travel-card a').get_attribute('href')=='viaggio-escursione-esempio.html'
   load(page,dest/'dist',('en/' if lang=='en' else '')+'viaggio-escursione-esempio.html')
   assert page.locator('.travel-gallery [data-travel-photo]').count()==2
   page.wait_for_function('()=>[...document.querySelectorAll(".travel-gallery img")].every(e=>e.complete&&e.naturalWidth>0)')
   page.locator('.travel-gallery [data-travel-photo]').first.click()
   assert page.locator('#travel-lightbox').evaluate('(el)=>el.open')
   assert page.locator('#travel-lightbox [data-travel-count]').inner_text()=='1 / 2'
   page.keyboard.press('ArrowRight')
   assert page.locator('#travel-lightbox [data-travel-count]').inner_text()=='2 / 2'
   page.wait_for_function('()=>document.querySelector("#travel-lightbox [data-travel-large]").complete&&document.querySelector("#travel-lightbox [data-travel-large]").naturalWidth>0')
   page.keyboard.press('Escape')
   assert not page.locator('#travel-lightbox').evaluate('(el)=>el.open')
   assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+2')
   checks.append(f'{lang} published album with 2 original photos and keyboard lightbox')
   page.close()
 browser.close()
(REPORT/'browser-travels.json').write_text(json.dumps({'passed':len(checks),'checks':checks,'screenshots':screenshot_files},ensure_ascii=False,indent=2)+'\n')
print(f'Travel browser checks: {len(checks)} passed')
