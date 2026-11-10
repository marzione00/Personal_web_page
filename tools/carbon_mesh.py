from pathlib import Path
import numpy as np
import struct,hashlib
O=Path(__file__).resolve().parents[1]/"public/geometry"
PALE=[193,239,213]
def norm(a):return a/max(np.linalg.norm(a),1e-10)
class Mesh:
 def __init__(self):self.v=[];self.f=[];self.c=[]
 def add(self,v,f,color):
  n=len(self.v);self.v.extend(np.asarray(v).tolist());self.f.extend((np.asarray(f)+n).tolist());self.c.extend([color]*len(v))
 def line(self,points,r=.009,color=PALE,sides=6):
  p=np.array(points);t=np.gradient(p,axis=0);rings=[];faces=[]
  for q,v in zip(p,t):
   z=norm(v);a=norm(np.cross(z,[0,0,1] if abs(z[2])<.9 else [0,1,0]));b=np.cross(z,a)
   rings.extend([q+r*(np.cos(j*2*np.pi/sides)*a+np.sin(j*2*np.pi/sides)*b) for j in range(sides)])
  for i in range(len(p)-1):
   for j in range(sides):a=i*sides+j;b=i*sides+(j+1)%sides;c=a+sides;e=b+sides;faces.extend([[a,b,e],[a,e,c]])
  self.add(rings,faces,color)
 def ball(self,p,r=.019,color=PALE):
  v=np.vstack([np.eye(3),-np.eye(3)])*r+p
  self.add(v,[[0,1,2],[1,3,2],[3,4,2],[4,0,2],[1,0,5],[3,1,5],[4,3,5],[0,4,5]],color)
 def save(self,id,camera):
  v=np.array(self.v);v-= (v.max(0)+v.min(0))/2;v*=2.45/np.ptp(v,axis=0).max()
  q=np.round(v*4096).astype('<i2');ix=np.asarray(self.f,dtype='<u2');colors=np.asarray(self.c,dtype='uint8')
  raw=struct.pack('<4sIIIff',b'MDC3',len(v),ix.size,0,*camera)+q.tobytes()+colors.tobytes()
  if len(raw)%2:raw+=b'\0'
  raw+=ix.tobytes();assert len(v)<60000 and ix.size<=180000,(id,len(v),ix.size);assert len(raw)<(300000 if id=='schwarzite-lattice' else 210000),(id,len(raw));(O/'scenes'/f'{id}.bin').write_bytes(raw)
  return dict(id=id,scene=f'scenes/{id}.bin',vertices=len(v),triangles=len(ix),sceneBytes=len(raw),sceneSha256=hashlib.sha256(raw).hexdigest())
