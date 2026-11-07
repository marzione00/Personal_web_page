"""Deterministic decorative scientific graphics. Does not read or modify photographs.
Run only to regenerate assets: Python 3 + numpy + scikit-image + Pillow.
Normal site builds use the checked-in SVG/WebP files and need only Node.js.
The G/P/D surfaces are nodal approximations, not relaxed atomic schwarzite models.
"""
from pathlib import Path
import json, math, hashlib
import numpy as np
from skimage.measure import marching_cubes
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'geometry';OUT.mkdir(exist_ok=True,parents=True)
registry=[]

def rotate(p, angles=(-.48,.62,-.18)):
    a,b,c=angles
    rx=np.array([[1,0,0],[0,np.cos(a),-np.sin(a)],[0,np.sin(a),np.cos(a)]])
    ry=np.array([[np.cos(b),0,np.sin(b)],[0,1,0],[-np.sin(b),0,np.cos(b)]])
    rz=np.array([[np.cos(c),-np.sin(c),0],[np.sin(c),np.cos(c),0],[0,0,1]])
    return p@(rz@rx@ry).T

def save_mesh(name, vertices, faces, angles=(-.48,.62,-.18), edge_width=.30, span=552, model=''):
    v=rotate(vertices,angles)
    # Orthographic projection preserves line geometry. Depth sorting hides rear faces.
    xy=v[:,:2].copy();xy[:,1]*=-1
    xy-= (xy.max(0)+xy.min(0))/2
    xy*= span/max(np.ptp(xy,axis=0))
    xy+=320
    tri=v[faces]
    n=np.cross(tri[:,1]-tri[:,0],tri[:,2]-tri[:,0]);n/=np.maximum(np.linalg.norm(n,axis=1)[:,None],1e-12)
    light=np.array([-.4,.65,1]);light/=np.linalg.norm(light)
    brightness=.14+.86*np.abs(n@light)**1.45
    z=tri[:,:,2].mean(1);zn=(z-z.min())/(np.ptp(z)+1e-9)
    brightness*= .58+.42*zn
    paths=[]
    for i in np.argsort(z):
        b=brightness[i]
        # Mint surface, softly lit; pale edges reveal the triangulation.
        fill=(int(10+36*b),int(26+96*b),int(21+66*b))
        edge=(int(60+104*b),int(100+113*b),int(76+96*b))
        p=xy[faces[i]]
        d=f'M{p[0,0]:.1f},{p[0,1]:.1f}L{p[1,0]:.1f},{p[1,1]:.1f}L{p[2,0]:.1f},{p[2,1]:.1f}Z'
        paths.append(f'<path d="{d}" fill="#{fill[0]:02x}{fill[1]:02x}{fill[2]:02x}" stroke="#{edge[0]:02x}{edge[1]:02x}{edge[2]:02x}" stroke-width="{edge_width}" stroke-linejoin="round"/>')
    svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">'+''.join(paths)+'</svg>'
    (OUT/(name+'.svg')).write_text(svg)
    registry.append({'id':name,'file':name+'.svg','model':model,'triangles':len(faces),'labels':False})

def surface(name, func, angles, model,extent=np.pi):
    n=46
    axis=np.linspace(-extent,extent,n)
    x,y,z=np.meshgrid(axis,axis,axis,indexing='ij')
    field=func(x,y,z).astype(np.float32)
    v,f,_,_=marching_cubes(field,level=0,spacing=(axis[1]-axis[0],)*3,step_size=2)
    v-=extent
    save_mesh(name,v,f,angles,model=model)

surface('gyroid',lambda x,y,z:np.sin(x)*np.cos(y)+np.sin(y)*np.cos(z)+np.sin(z)*np.cos(x),(-.48,.56,-.20),'sin(x)cos(y)+sin(y)cos(z)+sin(z)cos(x)=0; nodal approximation')
surface('schwarz-p',lambda x,y,z:np.cos(x)+np.cos(y)+np.cos(z),(-.52,.64,.10),'cos(x)+cos(y)+cos(z)=0; nodal approximation')
surface('schwarz-d',lambda x,y,z:np.cos(x)*np.cos(y)*np.cos(z)-np.sin(x)*np.sin(y)*np.sin(z),(-.42,.66,-.24),'cos(x)cos(y)cos(z)-sin(x)sin(y)sin(z)=0; nodal approximation',extent=np.pi*.86)
# True parametrised helicoid x=u*cos(v), y=u*sin(v), z=pitch*v.
u=np.linspace(-1.8,1.8,19);v=np.linspace(-np.pi*1.7,np.pi*1.7,90)
vtx=np.array([[a*np.cos(b),a*np.sin(b),.35*b] for b in v for a in u]);f=[]
for j in range(len(v)-1):
 for i in range(len(u)-1):
  a=j*len(u)+i;b=a+1;c=a+len(u);d=c+1
  f.extend([[a,b,d],[a,d,c]])
save_mesh('helicoid',vtx,np.array(f),(-.82,.25,.19),edge_width=.38,model='x=u cos(v), y=u sin(v), z=0.35v')
# Sierpinski tetrahedron, four recursive corner copies per level.
tetra=np.array([[0,0,1.7],[1.6,0,-.7],[-.8,1.3856,-.7],[-.8,-1.3856,-.7]])
tets=[tetra]
for depth in range(4): tets=[(t+corner)/2 for t in tets for corner in t]
vertices=np.concatenate(tets); faces=[]
for i in range(len(tets)):
 for f in [[0,1,2],[0,2,3],[0,3,1],[1,3,2]]:faces.append(np.array(f)+i*4)
save_mesh('sierpinski',vertices,np.array(faces),(-1.20,.15,-.10),edge_width=.57,model='Sierpinski tetrahedron; four half-scale corner copies; depth 4')
# A wireframe torus is retained as a secondary motif, not the entire visual system.
verts=[];faces=[];nu,nv=65,30
for i in range(nu):
 for j in range(nv):
  a=i*2*np.pi/nu;b=j*2*np.pi/nv
  verts.append([(1.8+.60*np.cos(b))*np.cos(a),(1.8+.60*np.cos(b))*np.sin(a),.60*np.sin(b)])
for i in range(nu):
 for j in range(nv):
  a=i*nv+j;b=((i+1)%nu)*nv+j;c=i*nv+(j+1)%nv;d=((i+1)%nu)*nv+(j+1)%nv
  faces.extend([[a,b,d],[a,d,c]])
save_mesh('torus',np.array(verts),np.array(faces),(-.95,.10,-.32),edge_width=.42,model='Torus; R=1.8, r=0.60')
# Julia fractal, smoothly coloured escape time. Independent generated graphic, not a photo.
w,h=1400,1000
xx=np.linspace(-1.65,1.65,w);yy=np.linspace(1.18,-1.18,h)
x,y=np.meshgrid(xx,yy);z=(x+1j*y)*np.exp(1j*.23);c=-.74543+.11301j
alive=np.ones((h,w),bool);smooth=np.zeros((h,w));last=np.zeros((h,w))
for k in range(240):
 z[alive]=z[alive]*z[alive]+c
 mag=np.abs(z)
 escaped=alive & (mag>10)
 if np.any(escaped):smooth[escaped]=k+1-np.log2(np.log(mag[escaped]))
 alive[escaped]=False
 if not alive.any():break
s=np.clip(smooth/35,0,1);rings=.5+.5*np.cos(smooth*.62)
strength=(.13+.70*rings)*np.minimum(1,smooth/18)
strength[alive]=0
# Fade outer empty area into transparent background without placing labels.
alpha=np.clip((smooth-1)/13,0,1);alpha[alive]=.85
base=np.array([8,17,13]);color=np.array([160,231,190])
rgb=base[None,None,:]+strength[:,:,None]*(color-base)[None,None,:]
rgba=np.dstack([np.uint8(np.clip(rgb,0,255)),np.uint8(alpha*255)])
Image.fromarray(rgba).save(OUT/'julia.webp',lossless=True,method=6)
registry.append({'id':'julia','file':'julia.webp','model':'z <- z^2 + c; c=-0.74543+0.11301i; 240 iterations; smooth escape-time colouring','labels':False})
for r in registry:
 data=(OUT/r['file']).read_bytes();r['sha256']=hashlib.sha256(data).hexdigest();r['bytes']=len(data)
(OUT/'manifest.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
print(json.dumps([{k:v for k,v in r.items() if k in ['id','bytes','triangles']} for r in registry],indent=2))
