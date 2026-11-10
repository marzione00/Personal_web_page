"""P688 carbon coordinates + Schwarz P nodal guide. Deterministic code geometry.
Uses the same crystallographic data as the design study; no image generation.
Runtime files are committed. Regeneration: python tools/generate-schwarzite.py.
Dependencies: numpy, cairosvg, Pillow. Source: doi:10.3390/nano11071694, table 8.
"""
from pathlib import Path
import json, math, struct, hashlib, io
import numpy as np
import cairosvg
from PIL import Image
R=Path(__file__).resolve().parents[1];O=R/'public/geometry';S=R/'source-materials/schwarzite'
d=json.loads((S/'p688.json').read_text());surface=np.array(d['mesh']);tri=np.array(d['triangles']);atoms=np.array(d['atomPositions'])
MINT=[122,211,172];PALE=[193,239,213];SKIN=[28,112,75]
from carbon_mesh import Mesh, norm
# Eight cells expose repetition in all three directions, with complete hexagons.
c=d['context'];raw=np.array(c['atoms'])*1.5+1.5
close_ids={i for i,p in enumerate(raw) if np.all((p>.5)&(p<2.5))}
close_faces=[f for f in c['faces'] if all(i in close_ids for i in f)]
assert len(close_ids)==384
assert sum(len(f)==6 for f in close_faces)==64
assert sum(len(f)==8 for f in close_faces)==48
close_points=(raw-1.5)[:,[1,2,0]]*1.5
close_edges=[(a,b) for a,b in c['edges'] if a in close_ids and b in close_ids]
mesh=Mesh()
for face in close_faces:
 v=close_points[face];mid=v.mean(0)
 mesh.add(np.vstack([mid,v]),[[0,i+1,(i+1)%len(face)+1] for i in range(len(face))],[8,24,16])
for a,b in close_edges:mesh.line([close_points[a],close_points[b]],r=.013,color=[153,231,181],sides=8)
for p in close_points[sorted(close_ids)]:mesh.ball(p,r=.024,color=[213,251,226])
main=mesh.save('schwarzite-neck',(.32,-.62))
mesh=Mesh();mesh.add(surface,tri,SKIN)
for curve,color in [(d['meridian'],[164,231,238]),(d['circumference'],[239,192,138])]:
 # A small normal offset makes the geometric guide visible above the triangulation.
 curve=np.array(curve);q=np.column_stack([curve[:,2]/3+.5,curve[:,0]/3,curve[:,1]/3]);normal=-np.sin(2*np.pi*q);normal=normal/np.linalg.norm(normal,axis=1)[:,None];normal=normal[:,[1,2,0]]
 mesh.line(curve-normal*.015,r=.014,color=color)
mesh.ball(np.array(d['p'])+[.01,.01,0],.029,[245,255,250]);sections=mesh.save('schwarzite-sections',(.38,-1.02))
c=d['context'];raw=np.array(c['atoms'])*1.5+1.5;keep=np.where(np.all((raw>0)&(raw<3),axis=1))[0];indices=set(keep.tolist());assert len(keep)==1296
mesh=Mesh();coords=(raw-1.5)*1.3
for f in c['faces']:
 if all(i in indices for i in f):
  v=coords[f];mid=v.mean(0);mesh.add(np.vstack([mid,v]),[[0,i+1,(i+1)%len(f)+1] for i in range(len(f))],[15,39,26])
for a,b in c['edges']:
 if a in indices and b in indices:mesh.line([coords[a],coords[b]],r=.010,sides=4)
 # The overview keeps carbon positions at bond junctions; fewer tube sides bound its transfer and rendering cost.
lattice=mesh.save('schwarzite-lattice',(.34,.59))
# Reproducible vector projection of the same carbon lattice; no nodal skin.
pitch,yaw=.32,-.62
rot=np.array([[1,0,0],[0,np.cos(pitch),-np.sin(pitch)],[0,np.sin(pitch),np.cos(pitch)]])@np.array([[np.cos(yaw),0,np.sin(yaw)],[0,1,0],[-np.sin(yaw),0,np.cos(yaw)]])
view=close_points@rot.T
visible=view[sorted(close_ids)];scale=550/max(np.ptp(visible[:,:2],axis=0))
pr=np.column_stack([400+view[:,0]*scale,320-view[:,1]*scale,view[:,2]])
light=norm(np.array([-.55,.85,1.15]));draw=[]
for face in close_faces:
 v=view[face];n=norm(np.cross(v[1]-v[0],v[2]-v[0]));n=n if n[2]>0 else -n
 rgb=np.array([8,24,16])*(.5+.5*max(0,n@light));col='#'+''.join(f'{round(x):02x}' for x in rgb)
 pts=' '.join(f'{x:.2f},{y:.2f}' for x,y,z in pr[face]);draw.append((v[:,2].mean(),f'<polygon points="{pts}" fill="{col}"/>'))
for a,b in close_edges:
 p,q=pr[a],pr[b];z=(p[2]+q[2])/2;depth=np.clip((z+1.2)/2.4,0,1);col='#'+''.join(f'{round(x*(.35+.65*depth)):02x}' for x in [169,239,192]);width=1.7+1.3*depth
 draw.append((z+.004,f'<path d="M{p[0]:.2f},{p[1]:.2f}L{q[0]:.2f},{q[1]:.2f}" fill="none" stroke="{col}" stroke-width="{width:.2f}" stroke-linecap="round"/>'))
for i in close_ids:
 x,y,z=pr[i];depth=np.clip((z+1.2)/2.4,0,1);col='#'+''.join(f'{round(v*(.4+.6*depth)):02x}' for v in [213,251,226]);draw.append((z+.012,f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{1.6+1.2*depth:.2f}" fill="{col}"/>'))
svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="640" viewBox="0 0 800 640">'+''.join(s for z,s in sorted(draw))+'</svg>'
(S/'schwarzite-neck.svg').write_text(svg)
im=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode())));image=O/'schwarzite-neck.webp';im.save(image,'WEBP',quality=92,method=6);b=image.read_bytes()
main.update(file=image.name,family='carbonio',model='P688 carbon lattice: 2×2×2 cells, 384 atoms, 64 complete hexagons and 48 complete octagons',labels=False,width=800,height=640,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),carbonAtoms=384,completeHexagons=64,completeOctagons=48,cellRepeats=[2,2,2],views=[dict(main,label={'it':'Reticolo carbonioso','en':'Carbon lattice'}),dict(sections,label={'it':'Due curvature','en':'Two curvatures'}),dict(lattice,label={'it':'Struttura P688','en':'P688 structure'},carbonAtoms=1296,cellRepeats=[3,3,3])])
manifest=json.loads((O/'manifest.json').read_text());found=any(g['id'] in ['graphene-ribbon','schwarzite-neck'] for g in manifest);manifest=[main if g['id'] in ['graphene-ribbon','schwarzite-neck'] else g for g in manifest];manifest=manifest if found else manifest+[main];(O/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for old in [O/'graphene-ribbon.webp',O/'scenes/graphene-ribbon.bin']:old.unlink(missing_ok=True)
print(json.dumps({g['id']:{'bytes':g['sceneBytes'],'vertices':g['vertices'],'triangles':g['triangles']} for g in [main,sections,lattice]},indent=2))
