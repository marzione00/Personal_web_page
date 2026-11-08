"""Generate reproducible, lightweight scientific illustrations and interactive meshes.
No photographs are read or written. Runtime needs only the committed files.
Python dependencies: numpy, scipy, scikit-image. Preview rendering is a separate step.
All stochastic illustrations use an explicit seed; they are not experimental data.
"""
from pathlib import Path
import json, math, hashlib, struct
import numpy as np
from skimage.measure import marching_cubes
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'geometry'; OUT.mkdir(exist_ok=True,parents=True)
SC=OUT/'scenes';SC.mkdir(exist_ok=True)
MINT=np.array([122,211,172]); PALE=np.array([195,237,212]); BLUE=np.array([103,190,213]); GOLD=np.array([209,190,135])
registry=[]
class Mesh:
 def __init__(self):self.v=[];self.f=[];self.c=[];self.lines=[]
 def add(self,v,f,color=MINT):
  v=np.asarray(v,float); f=np.asarray(f,int); n=len(self.v);self.v.extend(v.tolist());self.f.extend((f+n).tolist())
  co=np.asarray(color); self.c.extend((np.tile(co,(len(v),1)) if co.ndim==1 else co).tolist());return n
 def line(self,points,color=PALE,r=.014,sides=6):
  p=np.asarray(points,float)
  if len(p)<2:return
  tang=np.gradient(p,axis=0);tang/=np.maximum(np.linalg.norm(tang,axis=1)[:,None],1e-9)
  rings=[];prev=None
  for point,d in zip(p,tang):
   ref=np.array([0,0,1]) if abs(d[2])<.9 else np.array([0,1,0])
   u=np.cross(d,ref);u/=max(np.linalg.norm(u),1e-9)
   if prev is not None and np.dot(u,prev)<0:u=-u
   w=np.cross(d,u);prev=u
   rings.extend([point+r*(np.cos(t)*u+np.sin(t)*w) for t in np.linspace(0,2*np.pi,sides,endpoint=False)])
  f=[]
  for i in range(len(p)-1):
   for j in range(sides):a=i*sides+j;b=i*sides+(j+1)%sides;c=a+sides;e=b+sides;f.extend([[a,b,e],[a,e,c]])
  self.add(rings,f,color)
 def tube(self,a,b,r=.014,color=MINT,sides=6):
  a=np.asarray(a,float);b=np.asarray(b,float);d=b-a
  if np.linalg.norm(d)<1e-8:return
  d/=np.linalg.norm(d); ref=np.array([0,0,1]) if abs(d[2])<.9 else np.array([0,1,0]);u=np.cross(d,ref);u/=np.linalg.norm(u);w=np.cross(d,u)
  ring=np.array([r*(np.cos(t)*u+np.sin(t)*w) for t in np.linspace(0,2*np.pi,sides,endpoint=False)])
  v=np.vstack([a+ring,b+ring]);f=[]
  for k in range(sides):j=(k+1)%sides; f.extend([[k,j,sides+j],[k,sides+j,sides+k]])
  self.add(v,f,color)
 def ball(self,center,r=.07,color=PALE,nu=10,nv=6):
  v,f=parametric(lambda u,t:np.stack([r*np.sin(t)*np.cos(u),r*np.sin(t)*np.sin(u),r*np.cos(t)],-1),nu,nv,(0,2*np.pi),(0,np.pi))
  self.add(v+np.asarray(center),f,color)
 def box(self,center,size,color=MINT):
  s=np.asarray(size) if np.ndim(size) else np.array([size]*3);p=np.asarray(center);v=np.array([[x,y,z] for x in [-.5,.5] for y in [-.5,.5] for z in [-.5,.5]])*s+p
  quads=[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];f=[]
  # Split faces to preserve hard edges through separate normals.
  for q in quads:self.add(v[q],[[0,1,2],[0,2,3]],color)
 def save(self,id,family,model,camera=(.42,-.52),mode='surface'):
  v=np.asarray(self.v,float);v=v[:,[0,2,1]] # Z-up generator -> Y-up viewer
  center=(v.max(0)+v.min(0))/2;v-=center;v*=2.45/max(np.ptp(v,axis=0));q=np.round(v*4096).astype(int)
  if len(v)>65535:raise ValueError(id+' too many vertices')
  ix=np.asarray(self.f,dtype='<u2').ravel();colors=np.clip(self.c,0,255).astype('uint8').ravel()
  raw=struct.pack('<4sIIIff',b'MDC3',len(v),len(ix),2 if mode=='fractal' else (1 if mode=='unlit' else 0),*camera)+q.astype('<i2').tobytes()+colors.tobytes()
  if len(raw)%2:raw+=b'\0'
  raw+=ix.tobytes();f=SC/(id+'.bin');f.write_bytes(raw)
  registry.append({'id':id,'file':id+'.webp','scene':'scenes/'+id+'.bin','family':family,'model':model,'vertices':len(v),'triangles':len(self.f),'sceneBytes':len(raw),'sceneSha256':hashlib.sha256(raw).hexdigest(),'labels':False,'width':800,'height':640})
  print(id,len(v),len(self.f),len(raw))
def parametric(fn,nu=60,nv=32,ur=(0,2*np.pi),vr=(-1,1)):
 u,v=np.meshgrid(np.linspace(*ur,nu),np.linspace(*vr,nv),indexing='ij');xyz=fn(u,v).reshape(-1,3);faces=[]
 for i in range(nu-1):
  for j in range(nv-1):a=i*nv+j;b=a+nv;faces.extend([[a,b,b+1],[a,b+1,a+1]])
 return xyz,np.array(faces)
def surface(id,fn,extent=np.pi,camera=(.40,-.55)):
 ax=np.linspace(-extent,extent,35);x,y,z=np.meshgrid(ax,ax,ax,indexing='ij');field=fn(x,y,z).astype('float32')
 v,f,_,_=marching_cubes(field,level=0,spacing=(ax[1]-ax[0],)*3,allow_degenerate=False);v-=extent
 from scipy.sparse import coo_matrix
 from scipy.sparse.csgraph import connected_components
 edge=np.vstack([f[:,[0,1]],f[:,[1,2]],f[:,[2,0]]]);adj=coo_matrix((np.ones(len(edge)),(edge[:,0],edge[:,1])),shape=(len(v),len(v)))
 _,labels=connected_components(adj,directed=False);counts=np.bincount(labels)
 f=f[counts[labels[f[:,0]]]>=max(20,int(len(v)*.02))];used=np.unique(f);renum=np.full(len(v),-1);renum[used]=np.arange(len(used));f=renum[f];v=v[used]
 m=Mesh();m.add(v,f);m.save(id,'carbonio','nodal',camera)
# 6 carbon-related models. The last is explicitly a geometric network, NOT an atomic schwarzite.
surface('gyroid',lambda x,y,z:np.sin(x)*np.cos(y)+np.sin(y)*np.cos(z)+np.sin(z)*np.cos(x))
surface('schwarz-p',lambda x,y,z:np.cos(x)+np.cos(y)+np.cos(z),camera=(.48,-.72))
surface('schwarz-d',lambda x,y,z:np.cos(x)*np.cos(y)*np.cos(z)-np.sin(x)*np.sin(y)*np.sin(z),extent=np.pi*.83,camera=(.39,-.43))
# Finite honeycomb ribbon with bonds of unit length.
pts={};edges=set()
for i in range(-4,5):
 for j in range(-1,2):
  center=np.array([1.5*i,np.sqrt(3)*(j+.5*(i%2)),0.])
  vv=[tuple(np.round(center+[np.cos(a),np.sin(a),0],7)) for a in np.arange(6)*np.pi/3]
  for p in vv:pts.setdefault(p,len(pts))
  for a,b in zip(vv,vv[1:]+vv[:1]):edges.add(tuple(sorted([pts[a],pts[b]])))
base=np.array(list(pts))
for id,vibration in [('graphene-ribbon',False),('vibrational-mode',True)]:
 m=Mesh();p=base.copy()
 if vibration:p[:,2]=1.1*np.sin(p[:,0]*.7)*np.cos(p[:,1]*.42)
 for a,b in edges:m.tube(p[a],p[b],.037,MINT,6)
 for k,point in enumerate(p):m.ball(point,.11,PALE if not vibration else BLUE if point[2]>0 else GOLD,nu=8,nv=5)
 m.save(id,'carbonio','ideal honeycomb; synthetic out-of-plane displacement' if vibration else 'ideal honeycomb; no relaxed atomic coordinates',camera=(.80,-.40))
m=Mesh()
# Three crossing axially scaled hyperbolic neck networks: geometric connectivity, not chemical bonds.
for axis in range(3):
 for angle in np.linspace(0,2*np.pi,10,endpoint=False):
  vv=[]
  for t in np.linspace(-1.1,1.1,22):
   p=np.array([.64*np.cosh(t)*np.cos(angle),.64*np.cosh(t)*np.sin(angle),t]);p=np.roll(p,axis);vv.append(p)
  m.line(vv,MINT,r=.019)
 for t in [-1.1,0,1.1]:
  vv=[np.roll([.64*np.cosh(t)*np.cos(a),.64*np.cosh(t)*np.sin(a),t],axis) for a in np.linspace(0,2*np.pi,50)];m.line(vv,PALE,r=.024)
m.save('schwarz-network','carbonio','three axially scaled hyperbolic necks; illustrative non-atomistic network',camera=(.39,-.56))
# Cybersecurity / XAI.
rng=np.random.default_rng(124)
m=Mesh();p=rng.normal(0,.24,(27,3));p[:9]+=np.array([-1.1,-.4,.2]);p[9:18]+=[.8,-.6,-.2];p[18:]+=[.0,1.,.55]
links=set()
for i in range(len(p)):
 for j in np.argsort(np.linalg.norm(p-p[i],axis=1))[1:4]:links.add(tuple(sorted((i,int(j)))))
links.update([(4,12),(13,22),(21,3)])
for i,j in links:m.tube(p[i],p[j],.013,MINT if i//9==j//9 else GOLD)
for i,point in enumerate(p):m.ball(point,.064,[PALE,BLUE,GOLD][i//9])
m.save('markov-network','sicurezza-xai','illustrative undirected probabilistic graph')
m=Mesh();p=[]
for level,n in enumerate([1,3,5,4,2]):
 for j in range(n):p.append([level*.8-1.6,(j-(n-1)/2)*.5,.45*np.sin(j*2+level)])
p=np.array(p);groups=[[0],[1,2,3],[4,5,6,7,8],[9,10,11,12],[13,14]]
for g,h in zip(groups[:-1],groups[1:]):
 for k,i in enumerate(g):
  for j in {h[k%len(h)],h[(k+1)%len(h)]}:
   m.tube(p[i],p[j],.016,MINT);d=p[j]-p[i];d/=np.linalg.norm(d);q=p[j]-.13*d
   for s in [-1,1]:m.tube(q,p[j]-.23*d+[0,.055*s,0],.015,PALE)
for i,point in enumerate(p):m.ball(point,.08,GOLD if i in [0,14] else PALE)
m.save('program-flow','sicurezza-xai','synthetic directed call / control flow graph',camera=(.12,-.15))
m=Mesh();fn=lambda x,y:1/(1+np.exp(-(1.2*x-.5*y+.45*x*y)))
v,f=parametric(lambda x,y:np.stack([x,y,1.65*fn(x,y)-.8],-1),48,38,(-2,2),(-1.6,1.6));c=np.outer(fn(v[:,0],v[:,1]),PALE)+(1-fn(v[:,0],v[:,1]))[:,None]*BLUE;m.add(v,f,c)
# Explicit level curve p=.5.
xs=np.linspace(-1.9,1.9,140);yy=-1.2*xs/(-.5+.45*xs);segments=[]
for x,y in zip(xs,yy):
 if abs(y)<1.6:segments.append([x,y,.02])
 elif len(segments)>1:m.line(segments,GOLD,.023);segments=[]
if len(segments)>1:m.line(segments,GOLD,.023)
m.save('decision-surface','sicurezza-xai','sigmoid(1.2x-0.5y+0.45xy)',camera=(.52,-.50))
m=Mesh();t=np.linspace(0,7*np.pi,180);signal=np.sin(t)+.34*np.sin(3.3*t)+.07*np.sin(19*t)
p=np.array([signal[:-12],signal[6:-6],signal[12:]]).T
m.line(p,BLUE,.025,8)
for i in range(0,len(p),18):m.ball(p[i],.055,PALE)
m.save('entropy-trace','sicurezza-xai','synthetic delay embedding; entropy is explained, not estimated here',camera=(.28,-.49))
# Quantum.
m=Mesh()
for phi in np.linspace(0,np.pi,10,endpoint=False):
 p=[[np.cos(t)*np.cos(phi),np.cos(t)*np.sin(phi),np.sin(t)] for t in np.linspace(0,2*np.pi,100)];m.line(p,BLUE,r=.008)
for z in [-.75,-.40,0,.4,.75]:
 r=np.sqrt(1-z*z);m.line([[r*np.cos(t),r*np.sin(t),z] for t in np.linspace(0,2*np.pi,100)],MINT,r=.01)
for a in np.eye(3):m.tube(-1.22*a,1.22*a,.009,PALE)
end=np.array([.57,.42,.706]);end/=np.linalg.norm(end);m.tube(np.zeros(3),end,.027,GOLD);m.ball(end,.075,GOLD);m.ball([0,0,0],.035,PALE)
m.save('bloch-sphere','quantum','unit sphere and a pure qubit state; no multi-qubit claim',camera=(.32,-.41))
m=Mesh();v,f=parametric(lambda x,y:np.stack([x,y,.34*(np.cos(3*x)+np.cos(3*y))],-1),58,52,(-2,2),(-2,2));val=(v[:,2]+.68)/1.36;colors=val[:,None]*PALE+(1-val[:,None])*BLUE;m.add(v,f,colors);m.save('interference','quantum','sum of two coherent waves at t=0',camera=(.64,-.45))
m=Mesh()
for y in [-.55,.55]:m.tube([-2,y,0],[2,y,0],.025,BLUE)
m.box([-.9,.55,0],[.50,.50,.28],PALE)
m.tube([.45,-.55,0],[.45,.55,0],.022,GOLD);m.ball([.45,.55,0],.08,GOLD)
m.line([[.45+.14*np.cos(t),-.55+.14*np.sin(t),0] for t in np.linspace(0,2*np.pi,38)],GOLD,.02)
m.tube([.45,-.7,0],[.45,-.4,0],.018,GOLD);m.tube([.3,-.55,0],[.6,-.55,0],.018,GOLD)
for y in [-.55,.55]:m.box([1.5,y,0],[.38,.45,.20],MINT)
m.save('quantum-circuit','quantum','H on first qubit followed by controlled X; output Bell state; geometric circuit with no labels',camera=(1.04,-.25))
m=Mesh();B=np.array([[.62,.10,.06],[.19,.67,0],[.10,.18,.68]]);p={}
for i in range(-2,3):
 for j in range(-2,3):
  for k in range(-1,2):
   pos=np.array([i,j,k])@B;p[(i,j,k)]=pos;m.ball(pos,.04,PALE,nu=6,nv=4)
for key,a in p.items():
 for ax in range(3):
  q=list(key);q[ax]+=1;q=tuple(q)
  if q in p:m.tube(a,p[q],.008,BLUE)
for b in B:m.tube([0,0,0],b,.026,GOLD)
m.save('lattice','quantum','three-dimensional integer lattice; illustration only, not ML-KEM dimensions',camera=(.4,-.58))
# Quantitative / stochastic.
m=Mesh();rng=np.random.default_rng(71);n=100;dt=1/(n-1);common=rng.normal(0,np.sqrt(dt),n-1)
for k in range(12):
 inc=.55*common+np.sqrt(1-.55**2)*rng.normal(0,np.sqrt(dt),n-1);W=np.r_[0,np.cumsum(inc)];t=np.linspace(0,1,n);S=np.exp((.07-.5*.32**2)*t+.32*W)
 pts=np.c_[4*t-2,np.full(n,(k-5.5)*.21),2*(S-1)];m.line(pts,BLUE*(1-k/14)+PALE*k/14,.013,6)
m.save('stochastic-paths','quantitativa','12 synthetic GBM paths; fixed seed; not market data',camera=(.30,-.40))
m=Mesh();fn=lambda x,y:np.exp(-.5*(x*x-1.1*x*y+y*y)/(.6975)) / (2*np.pi*np.sqrt(.6975))
v,f=parametric(lambda x,y:np.stack([x,y,9*fn(x,y)-.7],-1),55,48,(-2.6,2.6),(-2.3,2.3));colors=(v[:,2]+.7)[:,None]/2.1*PALE+(1-(v[:,2]+.7)[:,None]/2.1)*MINT;m.add(v,f,colors);m.save('gaussian-density','quantitativa','bivariate normal density, variances 1 and correlation .55; height scaled',camera=(.6,-.6))
m=Mesh();T=np.array([[1.6,.5,.1],[0,.85,.24],[0,0,.65]])
v,f=parametric(lambda u,t:np.stack([np.sin(t)*np.cos(u),np.sin(t)*np.sin(u),np.cos(t)],-1),48,28,(0,2*np.pi),(0,np.pi));m.add(v@T.T,f,MINT)
for ax in range(3):
 p=np.zeros((100,3));p[:,(ax+1)%3]=np.cos(np.linspace(0,2*np.pi,100));p[:,(ax+2)%3]=np.sin(np.linspace(0,2*np.pi,100));m.line(p@T.T,PALE,r=.017)
m.save('covariance','quantitativa','ellipsoid x^T Sigma^-1 x=1, Sigma=T T^T; not an efficient frontier',camera=(.39,-.48))
# Mathematical / fractals.
m=Mesh();m.add([[-1.65,-1.30,0],[1.65,-1.30,0],[1.65,1.30,0],[-1.65,1.30,0]],[[0,1,2],[0,2,3]],MINT)
m.save('julia','geometria','planar Julia escape-time approximation z -> z^2+c; c=-.74543+.11301i; 180 shader iterations',camera=(1.48,0),mode='fractal')
m=Mesh();tet=np.array([[0,0,1.4],[1.32,0,-.5],[-.66,1.143,-.5],[-.66,-1.143,-.5]]);tets=[tet]
for _ in range(3):tets=[(t+v)/2 for t in tets for v in t]
for i,t in enumerate(tets):
 for a,b,c in [[0,1,2],[0,2,3],[0,3,1],[1,3,2]]:m.add(t[[a,b,c]],[[0,1,2]],MINT if i%3 else PALE)
m.save('sierpinski','geometria','Sierpinski tetrahedron, depth 3',camera=(.48,-.62))
m=Mesh();cubes=[(np.zeros(3),2.)]
for _ in range(2):
 cubes=[(p+np.array([i,j,k])*s/3,s/3) for p,s in cubes for i in [-1,0,1] for j in [-1,0,1] for k in [-1,0,1] if (i==0)+(j==0)+(k==0)<2]
for p,s in cubes:m.box(p,s,MINT)
m.save('menger','geometria','Menger sponge, finite depth 2; 400 cubes',camera=(.40,-.62))
for id,fn,nu,nv,ur,vr,cam in [
 ('mobius',lambda u,v:np.stack([(1+.35*v*np.cos(u/2))*np.cos(u),(1+.35*v*np.cos(u/2))*np.sin(u),.35*v*np.sin(u/2)],-1),100,20,(0,2*np.pi),(-1,1),(.60,-.65)),
 ('helicoid',lambda u,v:np.stack([u*np.cos(v),u*np.sin(v),.23*v],-1),24,92,(-1.2,1.2),(-1.8*np.pi,1.8*np.pi),(.30,-.47)),
 ('catenoid',lambda u,v:np.stack([.8*np.cosh(v)*np.cos(u),.8*np.cosh(v)*np.sin(u),.8*v],-1),72,35,(0,2*np.pi),(-1.12,1.12),(.30,-.40)),
 ('torus',lambda u,v:np.stack([(1+.38*np.cos(v))*np.cos(u),(1+.38*np.cos(v))*np.sin(u),.38*np.sin(v)],-1),72,35,(0,2*np.pi),(0,2*np.pi),(.73,-.43))]:
 m=Mesh();v,f=parametric(fn,nu,nv,ur,vr);m.add(v,f,MINT);m.save(id,'geometria','parametric '+id,camera=cam)
assert len(registry)==24
(OUT/'manifest.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
print('Total binary mesh bytes',sum(x['sceneBytes'] for x in registry))
