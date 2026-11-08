"""Render static previews with the same WebGL viewer used by the site.
Optional tool: Playwright + Pillow and a Chromium installation with WebGL.
On headless Linux an Xvfb display may be needed. This does not read photographs.
"""
from pathlib import Path
import json,base64,io,os
from PIL import Image,ImageDraw,ImageFont
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];out=R/'public/geometry';out.mkdir(exist_ok=True)
reg=json.loads((out/'manifest.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_BIN','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle'])
 page=b.new_page(viewport={'width':800,'height':640},device_scale_factor=1)
 page.set_content('<html><style>html,body{margin:0;background:transparent}#stage{width:800px;height:640px;position:relative}canvas{display:block;width:100%;height:100%}</style><div id="stage"></div></html>')
 page.add_script_tag(path=str(R/'public/assets/geometry-viewer.js'))
 page.evaluate('window.V = new MDCGeometry.Viewer();V.attach(document.querySelector("#stage"));')
 for item in reg:
  raw=(out/item['scene']).read_bytes();enc=base64.b64encode(raw).decode()
  page.evaluate('s=>{const a=Uint8Array.from(atob(s),c=>c.charCodeAt(0));V.load(a.buffer);V.render()}',enc)
  page.wait_for_timeout(70)
  png=page.evaluate('V.canvas.toDataURL("image/png").split(",")[1]')
  im=Image.open(io.BytesIO(base64.b64decode(png)))
  im.save(out/item['file'],'WEBP',quality=91,method=6)
  import hashlib
  d=(out/item['file']).read_bytes();item.update(bytes=len(d),sha256=hashlib.sha256(d).hexdigest())
 b.close()
(out/'manifest.json').write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
# review contact sheet only; labels live outside the graphics and are not site assets.
W=1600;cw=400;ch=350;sheet=Image.new('RGB',(W,ch*6),'#0b1411');dr=ImageDraw.Draw(sheet)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
for i,g in enumerate(reg):
 im=Image.open(out/g['file']).convert('RGBA');im.thumbnail((390,310));x=(i%4)*cw+(cw-im.width)//2;y=(i//4)*ch
 sheet.paste(im,(x,y),im);dr.text(((i%4)*cw+15,y+318),g['id'],fill='#b1e5cb',font=font)
(R/'reports').mkdir(exist_ok=True)
sheet.save(R/'reports/catalog-review.jpg',quality=94)
print('Geometry preview bytes',sum(g['bytes'] for g in reg))
