"""Focused release tests. Uses inherited virtual-origin fixtures; no production deploy claimed."""
from ambient_browser_fixture import *
import os,time,base64
checks=[]
def check(name,ok,detail=None):
 checks.append({'name':name,'passed':bool(ok),**({'detail':detail} if detail is not None else {})})
 print(('PASS ' if ok else 'FAIL ')+name,detail if detail and not ok else '',flush=True)
P=R/'anteprime';OUT=R/'reports'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for lang in ['it','en']:
  pre='en/' if lang=='en' else ''
  page=b.new_page(viewport={'width':1440,'height':1000})
  errors,req=setup(page,pre+'index.html');page.wait_for_timeout(400)
  check(lang+': brand',page.locator('.header .brand-word').inner_text()=='MANIFOLD')
  check(lang+': no music request before consent',not any('.mp3' in u for u in req))
  check(lang+': no player allocated before consent',not page.evaluate('ManifoldMusic.loaded'))
  page.locator('[data-effects-open]').click()
  play=page.locator('[data-music-play]');play.click()
  try: page.wait_for_function('()=>ManifoldMusic.playing && ManifoldMusic.position>.15',timeout=15000);playing=True
  except:playing=False
  check(lang+': actual audio playback',playing,page.locator('[data-music-status]').inner_text())
  check(lang+': correct relative audio path',any('/audio/local-coordinates.mp3' in u and '/en/audio/' not in u for u in req),req)
  check(lang+': UI effects remain independently muted',not page.evaluate('MDCSound.enabled'))
  page.locator('[data-music-volume]').fill('30');check(lang+': adjustable volume',abs(page.evaluate('ManifoldMusic.volume')-.30)<.001)
  page.screenshot(path=str(P/f'music-player-{lang}.png'))
  play.click();page.wait_for_timeout(450);pos=page.evaluate('ManifoldMusic.position');page.wait_for_timeout(300)
  check(lang+': pause holds position',not page.evaluate('ManifoldMusic.playing') and abs(page.evaluate('ManifoldMusic.position')-pos)<.05)
  page.locator('[data-music-reset]').click();check(lang+': reset restores start',page.evaluate('ManifoldMusic.position')<.05)
  page.keyboard.press('Escape');check(lang+': preferences restores focus',page.locator('[data-effects-open]').evaluate('e=>e===document.activeElement'))
  check(lang+': runtime and CSP',not errors,errors);page.close()
 # Direction and visual boundaries under normal motion.
 p=b.new_page(viewport={'width':2400,'height':1200});errors,req=setup(p);p.wait_for_timeout(450)
 before=p.evaluate('MDCMatrixDebug.streams');p.wait_for_timeout(500);after=p.evaluate('MDCMatrixDebug.streams');period=p.evaluate('MDCMatrixDebug.texturePeriod')
 deltas=[(bb['y']-aa['y'])%period for aa,bb in zip(before,after)]
 check('all rain columns move downward',len(deltas)>90 and all(0<d<30 for d in deltas),deltas[:5])
 check('rain visible on both sides',len(p.evaluate('MDCMatrixDebug.regions'))==2)
 p.wait_for_timeout(3300);p.screenshot(path=str(P/'home-manifold-wide.png'))
 p.locator('[data-reading]').click();p.wait_for_timeout(160);p.screenshot(path=str(P/'home-manifold-light.png'));p.close()
 # Public editorial pages in each language and responsive view.
 for lang in ['it','en']:
  for width in [390,1440]:
   for name in ['manifold.html','licenza.html','musica.html']:
    p=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');err,req=setup(p,('en/' if lang=='en' else '')+name)
    p.evaluate("async()=>{for(const i of document.querySelectorAll('main img')){i.loading='eager';try{await i.decode()}catch{}}}")
    check(f'{lang}/{width}/{name}: readable',p.locator('main h1').count()==1 and p.evaluate('document.documentElement.scrollWidth<=innerWidth') and not err,err)
    check(f'{lang}/{width}/{name}: no download of music',not any('.mp3' in u for u in req))
    p.screenshot(path=str(P/f'{name[:-5]}-{lang}-{width}.png'),full_page=True)
    if name=='manifold.html' and width==1440:p.locator('.manifold-examples').screenshot(path=str(P/f'manifold-examples-{lang}.png'))
    p.close()
 # Portable preview: music keeps playing across same-document routes; bilingual link remains valid.
 p=b.new_page(viewport={'width':1440,'height':950});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.set_content((R/'MANIFOLD_anteprima.html').read_text(),wait_until='load');p.locator('[data-effects-open]').click();p.locator('[data-music-play]').click()
 try:p.wait_for_function('()=>ManifoldMusic.playing && ManifoldMusic.position>.3',timeout=15000);ok=True
 except:ok=False
 check('offline original audio works without server',ok,errors)
 p.keyboard.press('Escape');pos=p.evaluate('ManifoldMusic.position');p.locator('#primary-nav a[href="ricerca.html"]').click();p.wait_for_timeout(700)
 check('offline soundtrack continues during transition',p.evaluate('ManifoldMusic.playing && ManifoldMusic.position')>pos)
 check('offline brand and page transition',p.locator('[data-view="ricerca.html"]').is_visible() and p.evaluate('MDCPageTransition.stats.offline')>=1)
 check('offline bilingual link keeps page',p.locator('[data-language="en"]').get_attribute('href')=='MANIFOLD_preview_EN.html#/ricerca.html')
 check('offline runtime',not errors,errors);p.close();b.close()
report={'version':'3.0','passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks,'method':'Chromium virtual-origin fixture and offline preview. Genuine MP3 playback and Web Audio, not mocked. Real cross-document playback persistence on the deployed host was not exercised; the player code saves the position and requires explicit resume.'}
(OUT/'browser-manifold.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print({k:v for k,v in report.items() if k!='checks'},flush=True)
raise SystemExit(bool(report['failed']))
