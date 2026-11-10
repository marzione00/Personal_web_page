"""Rebuild the 19 remaining procedural models, then the approved carbon/XAI families.

All mathematical parameters are retained. Meshes, previews and construction data
share one source. Runtime uses the committed MDC3 files; no Python is required.
Use --remaining-only to leave the nine previously approved models byte-identical.
"""
from pathlib import Path
from collections import defaultdict
import hashlib, itertools, json, struct, subprocess, sys
import numpy as np
from scipy.spatial import ConvexHull
from skimage.measure import marching_cubes, find_contours
from PIL import Image
from geometry_mesh import Mesh, norm, tube, preview, MINT, PALE, TEAL, GOLD

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/geometry'
SOURCE = ROOT / 'source-materials/atlas-models'
SOURCE.mkdir(parents=True, exist_ok=True)
SKIN = np.array([19, 49, 39])
BLUE = np.array([94, 179, 190])
models = {}


def line(m, p, color=MINT, radius=.009, sides=4):
    tube(m, p, radius, color, sides)


def arrow(m, a, b, color=GOLD, radius=.016, head=.12):
    a, b = np.array(a, float), np.array(b, float)
    d = norm(b-a)
    side = norm(np.cross(d, [0, 0, 1] if abs(d[2]) < .9 else [0, 1, 0]))
    normal = np.cross(d, side)
    ring = [b-head*d+head*.35*(np.cos(v)*side+np.sin(v)*normal) for v in np.arange(6)*np.pi/3]
    line(m, [a,b-head*.7*d], color, radius)
    m.add([b,*ring], [[0,i+1,(i+1)%6+1] for i in range(6)], color)


def grid(m, fn, us, vs, u_stride=4, v_stride=4, radius=.006, color=MINT):
    u,v=np.meshgrid(us,vs,indexing='ij')
    points=fn(u,v)
    faces=[]
    nv=len(vs)
    for i in range(len(us)-1):
        for j in range(nv-1):
            a=i*nv+j;b=a+nv
            faces.extend([[a,b,b+1],[a,b+1,a+1]])
    start=len(m.v)
    m.add(points.reshape(-1,3),faces,SKIN)
    # A spatial colour gradient reinforces depth; it is not a measured scalar field.
    z=points[:,:,2].reshape(-1)
    light=(z-z.min())/max(np.ptp(z),1e-8)
    for i,t in enumerate(light):m.c[start+i]=(SKIN*(.75+.6*t)).tolist()
    for i in sorted(set(range(0,len(us),u_stride))|{len(us)-1}):line(m,points[i],color,radius)
    for j in sorted(set(range(0,len(vs),v_stride))|{len(vs)-1}):line(m,points[:,j],color,radius)
    return points


def tpms(id):
    functions={
      'gyroid':lambda x,y,z:np.sin(x)*np.cos(y)+np.sin(y)*np.cos(z)+np.sin(z)*np.cos(x),
      'schwarz-p':lambda x,y,z:np.cos(x)+np.cos(y)+np.cos(z),
      'schwarz-d':lambda x,y,z:np.cos(x)*np.cos(y)*np.cos(z)-np.sin(x)*np.sin(y)*np.sin(z)}
    fn=functions[id];extent=np.pi*(.83 if id=='schwarz-d' else 1)
    ax=np.linspace(-extent,extent,21)
    x,y,z=np.meshgrid(ax,ax,ax,indexing='ij')
    v,f,_,_=marching_cubes(fn(x,y,z).astype('float32'),0,spacing=(ax[1]-ax[0],)*3,allow_degenerate=False)
    v-=extent
    m=Mesh();m.add(v,f,SKIN*1.35)
    # Sections are intersections of the analytic level set with coordinate planes.
    slices=[];sample=np.linspace(-extent,extent,81)
    a,b=np.meshgrid(sample,sample,indexing='ij')
    for axis in range(3):
        for level in np.linspace(-extent*.75,extent*.75,5):
            coords=[None]*3;coords[axis]=np.full_like(a,level)
            free=[k for k in range(3) if k!=axis];coords[free[0]]=a;coords[free[1]]=b
            for contour in find_contours(fn(*coords),0):
                if len(contour)<7:continue
                # Equal arc-length samples avoid seams or density clumps.
                distance=np.r_[0,np.cumsum(np.linalg.norm(np.diff(contour,axis=0),axis=1))]
                count=max(8,min(24,int(distance[-1]/2)+1))
                samples=np.linspace(0,distance[-1],count)
                xy=np.stack([np.interp(samples,distance,contour[:,k]) for k in [0,1]],-1)
                p=np.zeros((count,3));p[:,axis]=level
                p[:,free]= -extent+xy*(sample[1]-sample[0])
                # Newton projection recovers the actual implicit level after resampling.
                for _ in range(3):
                    step=1e-5
                    grad=np.stack([(fn(*(p+np.eye(3)[k]*step).T)-fn(*(p-np.eye(3)[k]*step).T))/(2*step) for k in free],-1)
                    p[:,free]-=fn(*p.T)[:,None]*grad/np.maximum((grad*grad).sum(1)[:,None],1e-12)
                # Two shallow offsets expose the same section from either side of the skin.
                # The analytic centreline remains in construction data; this is stroke thickness.
                step=1e-5
                normal=np.stack([(fn(*(p+np.eye(3)[k]*step).T)-fn(*(p-np.eye(3)[k]*step).T))/(2*step) for k in range(3)],-1)
                normal/=np.maximum(np.linalg.norm(normal,axis=1)[:,None],1e-12)
                for side in [-1,1]:
                    line(m,p+side*.055*normal,GOLD if axis==2 and level==0 else MINT if axis!=1 else BLUE,.020 if level==0 and axis==2 else .014,3)
                slices.append({'axis':axis,'level':float(level),'points':p.tolist()})
    models[id]={'kind':'implicit','extent':extent,'surfaceVertices':v.tolist(),'sections':slices,'nodalApproximation':True,'sectionStrokeOffset':.055}
    return m


def vibration():
    points={};edges=set()
    for i in range(-4,5):
        for j in range(-1,2):
            center=np.array([1.5*i,np.sqrt(3)*(j+.5*(i%2)),0.])
            ring=[tuple(np.round(center+[np.cos(a),np.sin(a),0],7)) for a in np.arange(6)*np.pi/3]
            for p in ring:points.setdefault(p,len(points))
            for a,b in zip(ring,ring[1:]+ring[:1]):edges.add(tuple(sorted([points[a],points[b]])))
    base=np.array(list(points));p=base.copy();p[:,2]=1.1*np.sin(p[:,0]*.7)*np.cos(p[:,1]*.42)
    m=Mesh()
    for a,b in sorted(edges):line(m,[p[a],p[b]],MINT,.039)
    for point in p:m.ball(point,.057,BLUE if point[2]>0 else GOLD)
    models['vibrational-mode']={'kind':'honeycomb','base':base.tolist(),'points':p.tolist(),'edges':sorted(edges),'normalModeComputed':False}
    return m


def neck_network():
    m=Mesh()
    for axis,color in enumerate([MINT,BLUE,PALE]):
        for a in np.linspace(0,2*np.pi,8,endpoint=False):
            p=[np.roll([.64*np.cosh(t)*np.cos(a),.64*np.cosh(t)*np.sin(a),t],axis) for t in np.linspace(-1.1,1.1,23)]
            line(m,p,color,.012)
        for t in [-1.1,-.55,0,.55,1.1]:
            p=[np.roll([.64*np.cosh(t)*np.cos(a),.64*np.cosh(t)*np.sin(a),t],axis) for a in np.linspace(0,2*np.pi,49)]
            line(m,p,GOLD if t==0 else color,.019 if t==0 else .011)
    models['schwarz-network']={'kind':'geometricNecks','axes':3,'meridiansPerAxis':8,'sectionsPerAxis':5,'atomistic':False,'radius':.64,'domain':[-1.1,1.1]}
    return m


def bloch():
    m=Mesh();t=np.linspace(0,2*np.pi,49)
    for phi in np.linspace(0,np.pi,6,endpoint=False):line(m,np.c_[np.cos(t)*np.cos(phi),np.cos(t)*np.sin(phi),np.sin(t)],BLUE,.006)
    for z in [-.75,-.4,0,.4,.75]:
        r=np.sqrt(1-z*z);line(m,np.c_[r*np.cos(t),r*np.sin(t),np.full_like(t,z)],MINT,.008 if z==0 else .005)
    for a in np.eye(3):arrow(m,-1.13*a,1.17*a,PALE,.006,.07)
    end=norm(np.array([.57,.42,.706]));arrow(m,[0,0,0],end,GOLD,.024,.13);m.ball(end,.045,GOLD)
    phi=np.arctan2(end[1],end[0]);theta=np.arccos(end[2])
    arc=np.linspace(0,theta,33);line(m,.55*np.c_[np.sin(arc)*np.cos(phi),np.sin(arc)*np.sin(phi),np.cos(arc)],GOLD,.009)
    arc=np.linspace(0,phi,25);line(m,.42*np.c_[np.cos(arc),np.sin(arc),np.zeros_like(arc)],GOLD,.009)
    models['bloch-sphere']={'kind':'bloch','state':end.tolist(),'theta':float(theta),'phi':float(phi),'pure':True}
    return m


def interference():
    m=Mesh();fn=lambda x,y:np.stack([x,y,.34*(np.cos(3*x)+np.cos(3*y))],-1)
    p=grid(m,fn,np.linspace(-2,2,33),np.linspace(-2,2,33),4,4)
    line(m,fn(np.linspace(-2,2,97),np.zeros(97)),GOLD,.024)
    line(m,fn(np.zeros(97),np.linspace(-2,2,97)),PALE,.012)
    models['interference']={'kind':'wave','points':p.reshape(-1,3).tolist(),'domain':[[-2,2],[-2,2]],'timeEvolution':False}
    return m


def box(m,center,size,color=MINT,outlined=True):
    p=np.array(list(itertools.product([-.5,.5],repeat=3)))*size+center
    for q in [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]]:m.add(p[q],[[0,1,2],[0,2,3]],SKIN)
    if outlined:
        for a,b in itertools.combinations(range(8),2):
            if (a^b) in [1,2,4]:line(m,p[[a,b]],color,.014)


def quantum_circuit():
    m=Mesh()
    for y in [-.6,.6]:
        arrow(m,[-2,y,0],[2,y,0],BLUE,.016,.11)
        m.ball([-2,y,0],.045,PALE)
    box(m,[-.95,.6,0],np.array([.55,.55,.28]),MINT)
    line(m,[[.35,-.6,0],[.35,.6,0]],GOLD,.022);m.ball([.35,.6,0],.08,GOLD)
    t=np.linspace(0,2*np.pi,49)
    line(m,np.c_[.35+.18*np.cos(t),-.6+.18*np.sin(t),np.zeros_like(t)],GOLD,.019)
    line(m,[[.17,-.6,0],[.53,-.6,0]],GOLD,.016)
    line(m,[[.35,-.78,0],[.35,-.42,0]],GOLD,.016)
    for y in [-.6,.6]:
        box(m,[1.43,y,0],np.array([.42,.46,.16]),MINT)
        t=np.linspace(0,np.pi,25)
        line(m,np.c_[1.43+.13*np.cos(t),y-.05+.13*np.sin(t),np.full_like(t,.09)],PALE,.008)
        line(m,[[1.43,y-.05,.09],[1.51,y+.09,.09]],GOLD,.009)
    models['quantum-circuit']={'kind':'circuit','qubits':2,'gates':[{'gate':'H','target':0},{'gate':'CX','control':0,'target':1}],'initialState':[1,0,0,0],'bellState':[float(1/np.sqrt(2)),0,0,float(1/np.sqrt(2))]}
    return m


def lattice():
    m=Mesh();B=np.array([[.62,.10,.06],[.19,.67,0],[.10,.18,.68]])
    p={key:np.array(key)@B for key in itertools.product(range(-2,3),range(-2,3),range(-1,2))}
    for pos in p.values():m.ball(pos,.024,PALE)
    for key,a in p.items():
        for axis in range(3):
            q=list(key);q[axis]+=1;q=tuple(q)
            if q in p:line(m,[a,p[q]],BLUE,.005)
    for b in B:arrow(m,[0,0,0],b,GOLD,.018,.10)
    for key in itertools.product([0,1],repeat=3):
        for axis in range(3):
            q=list(key);q[axis]+=1
            if q[axis]<=1:line(m,[np.array(key)@B,np.array(q)@B],MINT,.010)
    models['lattice']={'kind':'integerLattice','basisRows':B.tolist(),'indices':[list(k) for k in p],'points':[v.tolist() for v in p.values()]}
    return m


def stochastic():
    m=Mesh();rng=np.random.default_rng(71);n=100;dt=1/(n-1)
    common=rng.normal(0,np.sqrt(dt),n-1);paths=[]
    for k in range(12):
        inc=.55*common+np.sqrt(1-.55**2)*rng.normal(0,np.sqrt(dt),n-1)
        W=np.r_[0,np.cumsum(inc)];t=np.linspace(0,1,n);S=np.exp((.07-.5*.32**2)*t+.32*W)
        points=np.c_[4*t-2,np.full(n,(k-5.5)*.21),2*(S-1)]
        line(m,points,GOLD if k==5 else BLUE*(1-k/14)+MINT*k/14,.018 if k==5 else .010,3)
        m.ball(points[-1],.033,GOLD if k==5 else PALE)
        paths.append({'t':t.tolist(),'W':W.tolist(),'S':S.tolist()})
    models['stochastic-paths']={'kind':'gbm','seed':71,'mu':.07,'sigma':.32,'commonCoefficient':.55,'paths':paths,'interpolation':'piecewise linear'}
    return m


def gaussian():
    m=Mesh();rho=.55;cov=np.array([[1,rho],[rho,1]])
    fn=lambda x,y:np.exp(-.5*(x*x-2*rho*x*y+y*y)/(1-rho*rho))/(2*np.pi*np.sqrt(1-rho*rho))
    p=grid(m,lambda x,y:np.stack([x,y,9*fn(x,y)-.7],-1),np.linspace(-2.6,2.6,31),np.linspace(-2.3,2.3,27),5,5,color=BLUE)
    contours=[];L=np.linalg.cholesky(cov)
    for r in [.65,1.15,1.7,2.2]:
        t=np.linspace(0,2*np.pi,81);xy=(r*np.c_[np.cos(t),np.sin(t)])@L.T
        xyz=np.c_[xy,9*fn(xy[:,0],xy[:,1])-.7+.012]
        line(m,xyz,GOLD if r==1.15 else PALE,.015 if r==1.15 else .009)
        contours.append({'radius':r,'points':xyz.tolist()})
    models['gaussian-density']={'kind':'normalDensity','covariance':cov.tolist(),'points':p.reshape(-1,3).tolist(),'contours':contours,'heightOffset':.012}
    return m


def covariance():
    m=Mesh();T=np.array([[1.6,.5,.1],[0,.85,.24],[0,0,.65]])
    fn=lambda u,v:np.stack([np.sin(v)*np.cos(u),np.sin(v)*np.sin(u),np.cos(v)],-1)@T.T
    p=grid(m,fn,np.linspace(0,2*np.pi,41),np.linspace(.001,np.pi-.001,21),5,4)
    values,vectors=np.linalg.eigh(T@T.T)
    for k in range(3):
        a=vectors[:,k]*np.sqrt(values[k]);arrow(m,-a,a,GOLD if k==2 else PALE,.013,.1)
    t=np.linspace(0,2*np.pi,81)
    circle=np.c_[np.cos(t),np.sin(t),np.zeros_like(t)]@T.T
    line(m,circle*1.025,GOLD,.018)
    models['covariance']={'kind':'covarianceEllipsoid','T':T.tolist(),'covariance':(T@T.T).tolist(),'eigenvalues':values.tolist(),'eigenvectors':vectors.T.tolist(),'points':p.reshape(-1,3).tolist()}
    return m


def julia():
    # Flat mathematical set: no fabricated volume or automatic tilt.
    m=Mesh();m.add([[-1.65,-1.30,0],[1.65,-1.30,0],[1.65,1.30,0],[-1.65,1.30,0]],[[0,1,2],[0,2,3]],MINT)
    models['julia']={'kind':'escapeTime','c':[-.74543,.11301],'iterations':180,'planar':True,'domain':[[-1.65,1.65],[-1.3,1.3]]}
    return m


def julia_preview():
    x,y=np.meshgrid(np.linspace(-1.65,1.65,580),np.linspace(1.30,-1.30,464))
    z=x+1j*y;count=np.full(x.shape,180.);active=np.ones(x.shape,bool)
    for j in range(180):
        z[active]=z[active]*z[active]+complex(-.74543,.11301)
        escaped=active&(np.abs(z)>10)
        count[escaped]=j+1-np.log2(np.log2(np.abs(z[escaped])))
        active[escaped]=False
    ring=.5+.5*np.cos(count*.53)
    level=np.where(count>178,.09,np.minimum(1,count/25)*(.24+.76*ring))
    low=np.array([.025,.065,.05]);high=np.array([.77,.94,.83])
    im=Image.fromarray(np.uint8(np.clip(low+(high-low)*level[:,:,None],0,1)*255))
    im.save(OUT/'julia.webp','WEBP',quality=68,method=6)
    raw=(OUT/'julia.webp').read_bytes()
    return {'file':'julia.webp','width':580,'height':464,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}


def sierpinski():
    m=Mesh();tet=np.array([[0,0,1.4],[1.32,0,-.5],[-.66,1.143,-.5],[-.66,-1.143,-.5]])
    tets=[tet]
    for _ in range(3):tets=[(t+v)/2 for t in tets for v in t]
    edges=set()
    for t in tets:
        for f in ConvexHull(t).simplices:m.add(t[f],[[0,1,2]],SKIN)
        for a,b in itertools.combinations(t,2):edges.add(tuple(sorted([tuple(a),tuple(b)])))
    for a,b in sorted(edges):line(m,[a,b],MINT,.008)
    models['sierpinski']={'kind':'sierpinski','depth':3,'tetrahedra':[t.tolist() for t in tets],'count':len(tets)}
    return m


def menger():
    m=Mesh();cells={(0,0,0)}
    for _ in range(2):cells={tuple(3*np.array(c)+[i,j,k]) for c in cells for i,j,k in itertools.product([-1,0,1],repeat=3) if (i==0)+(j==0)+(k==0)<2}
    edges=defaultdict(set);exposed=0
    for center in sorted(cells):
        for axis in range(3):
            free=[k for k in range(3) if k!=axis]
            for sign in [-1,1]:
                neighbor=list(center);neighbor[axis]+=sign
                if tuple(neighbor) in cells:continue
                corners=[]
                for a,b in [(-1,-1),(1,-1),(1,1),(-1,1)]:
                    q=2*np.array(center);q[axis]+=sign;q[free[0]]+=a;q[free[1]]+=b;corners.append(tuple(q))
                p=np.array(corners)/9
                m.add(p,[[0,1,2],[0,2,3]],SKIN*(1.0+.25*axis));exposed+=1
                for a,b in zip(corners,corners[1:]+corners[:1]):edges[tuple(sorted((a,b)))].add((axis,sign))
    # Merge collinear crease segments; coplanar voxel boundaries disappear.
    groups=defaultdict(list)
    for (a,b),normals in edges.items():
        if len(normals)<2:continue
        axis=next(k for k in range(3) if a[k]!=b[k]);fixed=tuple(a[k] for k in range(3) if k!=axis)
        groups[(axis,fixed)].append(sorted((a[axis],b[axis])))
    merged=[]
    for (axis,fixed),segments in groups.items():
        intervals=[]
        for lo,hi in sorted(segments):
            if intervals and lo<=intervals[-1][1]:intervals[-1][1]=max(hi,intervals[-1][1])
            else:intervals.append([lo,hi])
        for lo,hi in intervals:
            a=list(fixed);a.insert(axis,lo);b=list(fixed);b.insert(axis,hi)
            line(m,np.array([a,b])/9,MINT,.0055)
            merged.append([a,b])
    models['menger']={'kind':'menger','depth':2,'cells':sorted(cells),'count':len(cells),'exposedFaces':exposed,'creaseSegments':len(merged)}
    return m


def parametric_model(id):
    functions={
      'mobius':lambda u,v:np.stack([(1+.35*v*np.cos(u/2))*np.cos(u),(1+.35*v*np.cos(u/2))*np.sin(u),.35*v*np.sin(u/2)],-1),
      'helicoid':lambda u,v:np.stack([u*np.cos(v),u*np.sin(v),.23*v],-1),
      'catenoid':lambda u,v:np.stack([.8*np.cosh(v)*np.cos(u),.8*np.cosh(v)*np.sin(u),.8*v],-1),
      'torus':lambda u,v:np.stack([(1+.38*np.cos(v))*np.cos(u),(1+.38*np.cos(v))*np.sin(u),.38*np.sin(v)],-1)}
    fn=functions[id];m=Mesh()
    us,vs,strides={
      'mobius':(np.linspace(0,2*np.pi,65),np.linspace(-1,1,9),(4,2)),
      'helicoid':(np.linspace(-1.2,1.2,13),np.linspace(-1.8*np.pi,1.8*np.pi,65),(3,4)),
      'catenoid':(np.linspace(0,2*np.pi,49),np.linspace(-1.12,1.12,21),(4,4)),
      'torus':(np.linspace(0,2*np.pi,49),np.linspace(0,2*np.pi,25),(4,4))}[id]
    p=grid(m,fn,us,vs,*strides)
    if id=='mobius':
        t=np.linspace(0,4*np.pi,161);boundary=fn(t,np.ones_like(t));line(m,fn(t,np.full_like(t,1.025)),GOLD,.020)
    elif id=='helicoid':
        for u in [-1.2,1.2]:line(m,fn(np.full_like(vs,u),vs),GOLD,.013)
    elif id=='catenoid':line(m,fn(np.linspace(0,2*np.pi,97),np.zeros(97))*[1.025,1.025,1],GOLD,.024)
    elif id=='torus':
        t=np.linspace(0,2*np.pi,97);line(m,fn(t,np.zeros_like(t)),GOLD,.014);line(m,fn(np.zeros_like(t),t),PALE,.013)
    models[id]={'kind':'parametric','points':p.reshape(-1,3).tolist(),'uRange':[float(us[0]),float(us[-1])],'vRange':[float(vs[0]),float(vs[-1])]}
    if id=='mobius':models[id]['boundary']=boundary.tolist()
    return m


def generate():
    manifest=json.loads((OUT/'manifest.json').read_text());lookup={a['id']:a for a in manifest}
    definitions=[
      ('gyroid',lambda:tpms('gyroid'),'carbonio',(.48,-.58)),
      ('schwarz-p',lambda:tpms('schwarz-p'),'carbonio',(.48,-.64)),
      ('schwarz-d',lambda:tpms('schwarz-d'),'carbonio',(.42,-.48)),
      ('vibrational-mode',vibration,'carbonio',(.82,-.42)),
      ('schwarz-network',neck_network,'carbonio',(.38,-.53)),
      ('bloch-sphere',bloch,'quantum',(.32,-.43)),
      ('interference',interference,'quantum',(.73,-.5)),
      ('quantum-circuit',quantum_circuit,'quantum',(1.15,-.16)),
      ('lattice',lattice,'quantum',(.43,-.56)),
      ('stochastic-paths',stochastic,'quantitativa',(.45,-.48)),
      ('gaussian-density',gaussian,'quantitativa',(.7,-.6)),
      ('covariance',covariance,'quantitativa',(.4,-.54)),
      ('julia',julia,'geometria',(np.pi/2,0)),
      ('sierpinski',sierpinski,'geometria',(.32,.22)),
      ('menger',menger,'geometria',(.4,-.62)),
      ('mobius',lambda:parametric_model('mobius'),'geometria',(.68,-.58)),
      ('helicoid',lambda:parametric_model('helicoid'),'geometria',(.3,-.5)),
      ('catenoid',lambda:parametric_model('catenoid'),'geometria',(.32,-.45)),
      ('torus',lambda:parametric_model('torus'),'geometria',(.76,-.43))]
    selected=next((a.split('=',1)[1].split(',') for a in sys.argv if a.startswith('--models=')),None)
    existing=json.loads((SOURCE/'models.json').read_text()) if selected else {}
    models.update(existing)
    for id,fn,family,camera in definitions:
        if selected and id not in selected:continue
        mesh=fn()
        # Proper rotation from Z-up construction to the viewer's Y-up frame.
        mesh.v=(np.array(mesh.v)[:,[0,2,1]]*[1,1,-1]).tolist()
        scene=mesh.save(id,camera)
        if id=='julia':
            raw=bytearray((OUT/scene['scene']).read_bytes());struct.pack_into('<I',raw,12,2)
            (OUT/scene['scene']).write_bytes(raw);scene['sceneSha256']=hashlib.sha256(raw).hexdigest();poster=julia_preview()
        else:poster=preview(id,mesh,camera,SOURCE,OUT,width=580,quality=68)
        entry={**scene,**poster,'family':family,'labels':False,'model':lookup[id]['model'],'ambientMotion':id!='julia'}
        lookup[id].clear();lookup[id].update(entry)
        models[id]['displayTransform']='(x,z,-y), then centre and uniformly normalise'
        print(id,entry['vertices'],entry['triangles'],entry['sceneBytes'],entry['bytes'],flush=True)
    assert len(definitions)==19 and len(manifest)==28
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    (SOURCE/'models.json').write_text(json.dumps(models,separators=(',',':'),default=lambda x:x.item())+'\n')
    if '--remaining-only' not in sys.argv:
        for name in ['generate-schwarzite.py','generate-carbon-family.py','generate-security-models.py']:
            subprocess.run([sys.executable,str(ROOT/'tools'/name)],check=True)


if __name__=='__main__':generate()
