"""Rebuild the exact-text social cards. Optional authoring tool: Python + Pillow.
The normal Node build uses the checked-in PNG files and needs no Python libraries.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math, random
root=Path(__file__).resolve().parents[1]
fonts=Path('/usr/share/fonts/truetype/dejavu')
def font(name,size):return ImageFont.truetype(str(fonts/name),size)
mono=font('DejaVuSansMono.ttf',18); small=font('DejaVuSans.ttf',22);title=font('DejaVuSerif.ttf',65); brand=font('DejaVuSansMono.ttf',25)
sections={'home':('Ricerca. Didattica.\nIdee in movimento.','Research. Teaching.\nIdeas in motion.'),'teaching':('Dal concetto\nall’esperimento.','From a concept\nto an experiment.'),'research':('Problemi, metodi,\nrisultati.','Questions, methods,\nresults.'),'writing':('Scrittura\ne riflessioni.','Writing\nand reflections.'),'travel':('Luoghi, percorsi,\nprospettive.','Places, journeys,\nperspectives.'),'profile':('Un percorso\nfra discipline.','A path\nacross disciplines.')}
labels={'home':('SITO PERSONALE','PERSONAL WEBSITE'),'teaching':('DIDATTICA · QUANTUM LAB','TEACHING · QUANTUM LAB'),'research':('RICERCA · PUBBLICAZIONI','RESEARCH · PUBLICATIONS'),'writing':('QUADERNO','JOURNAL'),'travel':('VIAGGI','TRAVEL'),'profile':('PROFILO','PROFILE')}
out=root/'public/media/images/share';out.mkdir(parents=True,exist_ok=True)
for kind,copies in sections.items():
 for i,lang in enumerate(['it','en']):
  im=Image.new('RGB',(1200,630),'#09110e');d=ImageDraw.Draw(im);rng=random.Random(35)
  for x in range(790,1180,26):
   for y in range(-10,620,28):
    lum=rng.randint(19,55);d.text((x,y),rng.choice('01ψφ∇λΣπ'),font=mono,fill=(lum//2,lum,lum*2//3))
  # Geometric contour: one consistent visual identity, no invented scientific result.
  for j in range(9):
   pts=[]
   for t in range(201):
    a=t*math.tau/200;pts.append((990+(94+j*8)*math.cos(a),314+(115+j*5)*math.sin(a)*math.cos(a*.5)))
   d.line(pts,fill=(50+j*7,105+j*10,72+j*8),width=1)
  d.line((64,70,64,108),fill='#afe7c6',width=3)
  d.text((82,73),'Topological Manifolds',font=brand,fill='#e9eee8')
  d.text((64,179),labels[kind][i],font=mono,fill='#afe7c6')
  d.multiline_text((60,238),copies[i],font=title,fill='#e9eee8',spacing=16)
  d.line((64,516,1136,516),fill='#314438',width=1)
  d.text((64,550),'Marzio De Corato',font=small,fill='#b2c1b5')
  d.text((1007,553),lang.upper()+' / MDC',font=mono,fill='#afe7c6')
  im.save(out/f'{kind}-{lang}.png',optimize=True)
print('12 social cards generated, 1200 × 630 px.')
