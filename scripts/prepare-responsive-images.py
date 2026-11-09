"""Generate delivery copies from the verified original; never overwrite source photographs."""
from pathlib import Path
import hashlib,json
from PIL import Image,ImageOps
root=Path(__file__).resolve().parent.parent
profile=json.loads((root/'content/profile.json').read_text())['homepagePhoto']
source=root/'public'/profile['file'].lstrip('/')
assert hashlib.sha256(source.read_bytes()).hexdigest()==profile['sha256']
out=root/'public/media/images/derived';out.mkdir(exist_ok=True)
records=[]
with Image.open(source) as original:
 image=ImageOps.exif_transpose(original).convert('RGB')
 for width in (480,768,1274):
  height=round(image.height*width/image.width)
  target=out/f'homepage-{width}.webp'
  image.resize((width,height),Image.Resampling.LANCZOS).save(target,'WEBP',quality=88,method=6)
  records.append({'file':str(target.relative_to(root/'public')),'width':width,'height':height,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
(root/'content/responsive-images.json').write_text(json.dumps({'sourceSha256':profile['sha256'],'images':records},indent=2)+'\n')
print(json.dumps(records,indent=2))
