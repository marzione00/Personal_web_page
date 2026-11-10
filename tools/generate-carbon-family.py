"""Idealised carbon graphs; shared MDC3 renderer and coordinate-derived SVG/WebP.
Regenerate with Python, numpy, Pillow and cairosvg. No downloaded imagery.
"""
from pathlib import Path
import itertools, json, hashlib, io
import numpy as np
import cairosvg
from PIL import Image
from carbon_mesh import Mesh, norm

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/geometry'
SOURCE=ROOT/'source-materials/carbon'
SOURCE.mkdir(exist_ok=True)
GREEN=[153,231,181];CYAN=[135,205,221];ATOM=[213,251,226]

def graph(points,faces):
    edges=sorted({tuple(sorted((f[i],f[(i+1)%len(f)]))) for f in faces for i in range(len(f))})
    return {'points':np.asarray(points).tolist(),'faces':faces,'edges':[list(e) for e in edges]}

def fullerene():
    phi=(1+np.sqrt(5))/2
    ico=np.array([np.roll([0,a,b*phi],k) for k in range(3) for a in [-1,1] for b in [-1,1]])
    edges={(a,b) for a in range(12) for b in range(a+1,12) if abs(np.linalg.norm(ico[a]-ico[b])-2)<1e-6}
    directed=[(a,b) for a,b in sorted(edges) for a,b in [(a,b),(b,a)]]
    index={pair:i for i,pair in enumerate(directed)}
    points=np.array([(2*ico[a]+ico[b])/3 for a,b in directed])
    faces=[]
    for a in range(12):
        ids=[index[(a,b)] for b in range(12) if (a,b) in index]
        n=norm(ico[a]);u=norm(points[ids[0]]-ico[a]);u=norm(u-n*np.dot(u,n));v=np.cross(n,u)
        ids.sort(key=lambda i:np.arctan2(np.dot(points[i]-ico[a],v),np.dot(points[i]-ico[a],u)))
        faces.append(ids)
    for a,b,c in itertools.combinations(range(12),3):
        if {(a,b),(a,c),(b,c)}<=edges:
            faces.append([index[p] for p in [(a,b),(b,a),(b,c),(c,b),(c,a),(a,c)]])
    return graph(points,faces)

def ribbon(angle=0,length=18,width=5.3):
    vertices=[];faces=[];lookup={};rot=np.array([[np.cos(angle),-np.sin(angle)],[np.sin(angle),np.cos(angle)]])
    for q in range(-18,19):
        for r in range(-18,19):
            center=np.array([np.sqrt(3)*(q+r/2),1.5*r]);face=[]
            for k in range(6):
                t=np.pi/6+k*np.pi/3;p=rot@(center+[np.cos(t),np.sin(t)]);key=tuple(np.round(p,7))
                if key not in lookup:lookup[key]=len(vertices);vertices.append([*p,0])
                face.append(lookup[key])
            faces.append(face)
    p=np.array(vertices);keep={i for i,v in enumerate(p) if abs(v[0])<length/2+.01 and abs(v[1])<width/2+.01}
    # Keep complete rings; degree-two boundary atoms form the physical carbon rim.
    faces=[f for f in faces if set(f)<=keep];keep=sorted({i for f in faces for i in f});ix={v:i for i,v in enumerate(keep)}
    return graph(p[keep],[[ix[i] for i in f] for f in faces])

def bilayer(shift):
    base=ribbon(length=9,width=6.4);p=np.array(base['points']);n=len(p)
    bottom=p+[0,0,-1.18];top=p+[shift,0,1.18]
    g=graph(np.vstack([bottom,top]),base['faces']+[[i+n for i in f] for f in base['faces']]);g['layers']=[0]*n+[1]*n
    return g

def preview(id,g,camera):
    p=np.array(g['points']);p-=(p.max(0)+p.min(0))/2
    pitch,yaw=camera
    rot=np.array([[1,0,0],[0,np.cos(pitch),-np.sin(pitch)],[0,np.sin(pitch),np.cos(pitch)]])@np.array([[np.cos(yaw),0,np.sin(yaw)],[0,1,0],[-np.sin(yaw),0,np.cos(yaw)]])
    v=p@rot.T;scale=min(650/np.ptp(v[:,0]),520/max(np.ptp(v[:,1]),.1));pr=np.column_stack([400+v[:,0]*scale,320-v[:,1]*scale,v[:,2]])
    span=max(np.ptp(v[:,2]),.01);depth=lambda z: .62+.38*(z-v[:,2].min())/span
    color=lambda rgb,k:'#'+''.join(f'{min(255,round(c*k)):02x}' for c in rgb)
    draw=[]
    for f in g['faces']:
        rgb=[24,30,17] if len(f)==5 else [8,24,16]
        draw.append((v[f,2].mean(),'<polygon points="'+' '.join(f'{x:.2f},{y:.2f}' for x,y,z in pr[f])+'" fill="'+color(rgb,1)+'"/>'))
    for a,b in g['edges']:
        x,y,z=pr[a];xx,yy,zz=pr[b];k=depth((z+zz)/2);rgb=CYAN if g.get('layers',[0]*len(p))[a] else GREEN
        draw.append(((z+zz)/2+.001,f'<path d="M{x:.2f},{y:.2f}L{xx:.2f},{yy:.2f}" stroke="{color(rgb,k)}" stroke-width="{2.5+2.5*k:.2f}" stroke-linecap="round"/>'))
    for i,(x,y,z) in enumerate(pr):draw.append((z+.002,f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{1.25+depth(z):.2f}" fill="{color(ATOM,depth(z))}"/>'))
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="640" viewBox="0 0 800 640">'+''.join(s for z,s in sorted(draw))+'</svg>'
    (SOURCE/f'{id}.svg').write_text(svg)
    im=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode())));im.save(OUT/f'{id}.webp','WEBP',quality=94,method=6)
    b=(OUT/f'{id}.webp').read_bytes()
    return dict(file=f'{id}.webp',width=800,height=640,bytes=len(b),sha256=hashlib.sha256(b).hexdigest())

def scene(id,g,camera):
    p=np.array(g['points']);m=Mesh();lengths=[np.linalg.norm(p[a]-p[b]) for a,b in g['edges']];unit=min(lengths)
    for f in g['faces']:
        points=p[f];m.add(np.vstack([points.mean(0),points]),[[0,i+1,(i+1)%len(f)+1] for i in range(len(f))],[24,30,17] if len(f)==5 else [8,24,16])
    layers=g.get('layers',[0]*len(p))
    for a,b in g['edges']:m.line([p[a],p[b]],r=.045*unit,color=CYAN if layers[a] else GREEN,sides=6)
    for point in p:m.ball(point,r=.065*unit,color=ATOM)
    return m.save(id,camera)

models={}
def register(id,g,camera,views=()):
    models[id]=g;entry=scene(id,g,camera);entry.update(preview(id,g,camera),family='carbonio',labels=False,carbonAtoms=len(g['points']),model='Idealised carbon bond graph; see scientific explanation',carbonLattice=True)
    if views:
        entry['views']=[dict(entry,label=views[0])]
        for vid,vg,vc,label in views[1:]:models[vid]=vg;entry['views'].append(dict(scene(vid,vg,vc),label=label))
    return entry

arm=ribbon(np.pi/2,length=18,width=6.8);zig=ribbon(length=18,width=6.4)
twist=json.loads(json.dumps(arm));p=np.array(twist['points']);theta=.16*p[:,0];p[:,2]=p[:,1]*np.sin(theta);p[:,1]*=np.cos(theta);twist['points']=p.tolist()
entries=[
    register('fullerene-cage',fullerene(),(.22,.48)),
    register('carbon-nanoribbon',arm,(.55,.20),[{'it':'Bordo armchair','en':'Armchair edge'},('carbon-zigzag',zig,(.55,.20),{'it':'Bordo zigzag','en':'Zigzag edge'})]),
    register('twisted-nanoribbon',twist,(.38,.22)),
    register('bilayer-nanoflake',bilayer(1.0),(1.02,.30),[{'it':'Strati traslati','en':'Shifted layers'},('bilayer-aligned',bilayer(0),(1.02,.30),{'it':'Strati allineati','en':'Aligned layers'})])
]
manifest=json.loads((OUT/'manifest.json').read_text());ids={e['id'] for e in entries};manifest=[g for g in manifest if g['id'] not in ids]+entries
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(SOURCE/'models.json').write_text(json.dumps(models,separators=(',',':'))+'\n')
print(json.dumps({e['id']:{'atoms':e['carbonAtoms'],'sceneBytes':e['sceneBytes'],'previewBytes':e['bytes']} for e in entries},indent=2))
