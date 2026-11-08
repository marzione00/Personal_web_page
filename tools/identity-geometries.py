"""Deterministic chart illustrations, without labels or modifications to photographs."""
from pathlib import Path
import numpy as np
import cairosvg
from PIL import Image
import io
R=Path(__file__).resolve().parents[1]
out=R/'public/media/images';out.mkdir(exist_ok=True,parents=True)
masters=R/'source-materials/identity-geometry';masters.mkdir(exist_ok=True,parents=True)
a,b,c=-.68,.45,-.20
rx=np.array([[1,0,0],[0,np.cos(a),-np.sin(a)],[0,np.sin(a),np.cos(a)]])
ry=np.array([[np.cos(b),0,np.sin(b)],[0,1,0],[-np.sin(b),0,np.cos(b)]])
rz=np.array([[np.cos(c),-np.sin(c),0],[np.sin(c),np.cos(c),0],[0,0,1]])
rot=rz@rx@ry

def make(name,fn,u,v,patch):
    verts=np.array([fn(i,j) for j in v for i in u]);view=verts@rot.T
    xy=view[:,:2].copy();xy[:,1]*=-1
    scale=600/max(np.ptp(xy,axis=0));xy-=(xy.max(0)+xy.min(0))/2;xy*=scale;xy+=[400,320]
    shapes=[]
    for j in range(len(v)-1):
      for i in range(len(u)-1):
        inds=np.array([j*len(u)+i,j*len(u)+i+1,(j+1)*len(u)+i+1,(j+1)*len(u)+i])
        pts=view[inds];normal=np.cross(pts[1]-pts[0],pts[3]-pts[0]);normal/=max(np.linalg.norm(normal),1e-9)
        light=.22+.78*abs(normal@np.array([-.2,.6,.77]))
        high=patch(i,j)
        base=np.array([26,58,45]);delta=np.array([54,96,69]);color=base+light*delta
        if high:color=np.array([95,174,130])+light*np.array([53,55,45])
        col='#'+''.join(f'{int(x):02x}' for x in color)
        p=xy[inds];d='M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in p)+'Z'
        shapes.append((pts[:,2].mean(),f'<path d="{d}" fill="{col}" stroke="{"#c9f1d7" if high else "#648a72"}" stroke-width="{1 if high else .7}" stroke-linejoin="round"/>'))
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="640" viewBox="0 0 800 640">'+''.join(s for z,s in sorted(shapes))+'</svg>'
    (masters/f'{name}.svg').write_text(svg)
    png=cairosvg.svg2png(bytestring=svg.encode(),output_width=800,output_height=640)
    Image.open(io.BytesIO(png)).save(out/f'manifold-{name}.webp',quality=90,method=6)
make('sphere',lambda u,v:[np.cos(u)*np.sin(v),np.sin(u)*np.sin(v),np.cos(v)],np.linspace(0,2*np.pi,37),np.linspace(.015,np.pi-.015,23),lambda i,j:22<=i<=28 and 4<=j<=8)
make('torus',lambda u,v:[(1.6+.56*np.cos(v))*np.cos(u),(1.6+.56*np.cos(v))*np.sin(u),.56*np.sin(v)],np.linspace(0,2*np.pi,43),np.linspace(0,2*np.pi,23),lambda i,j:4<=i<=10 and 2<=j<=6)
make('mobius',lambda u,v:[(1+v*.38*np.cos(u/2))*np.cos(u),(1+v*.38*np.cos(u/2))*np.sin(u),v*.38*np.sin(u/2)],np.linspace(0,2*np.pi,65),np.linspace(-1,1,11),lambda i,j:10<=i<=19 and 3<=j<=6)
print('Three illustrations ready.')
