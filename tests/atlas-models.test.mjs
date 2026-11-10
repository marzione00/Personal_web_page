import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const models=JSON.parse(fs.readFileSync(new URL('../source-materials/atlas-models/models.json',import.meta.url)));
const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const matvec=(m,v)=>m.map(row=>dot(row,v));

test('the remaining 19 models retain their identity and finite construction witnesses',()=>{
 assert.equal(Object.keys(models).length,19);
 const scan=x=>{if(typeof x==='number')assert.ok(Number.isFinite(x));else if(x&&typeof x==='object')Object.values(x).forEach(scan);};scan(models);
 for(const g of Object.values(models))assert.equal(g.displayTransform,'(x,z,-y), then centre and uniformly normalise');
});
test('TPMS reticles stay on the declared nodal surfaces and coordinate sections',()=>{
 const fields={gyroid:(x,y,z)=>Math.sin(x)*Math.cos(y)+Math.sin(y)*Math.cos(z)+Math.sin(z)*Math.cos(x),'schwarz-p':(x,y,z)=>Math.cos(x)+Math.cos(y)+Math.cos(z),'schwarz-d':(x,y,z)=>Math.cos(x)*Math.cos(y)*Math.cos(z)-Math.sin(x)*Math.sin(y)*Math.sin(z)};
 for(const [id,f] of Object.entries(fields)){
  const g=models[id];assert.equal(g.nodalApproximation,true);assert.ok(g.sections.length>=15);
  for(const section of g.sections)for(const p of section.points){near(p[section.axis],section.level);near(f(...p),0,2e-5);}
  for(const p of g.surfaceVertices)near(f(...p),0,.035);
 }
});
test('out-of-plane honeycomb preserves unit reference bonds and the original displacement',()=>{
 const g=models['vibrational-mode'];assert.equal(g.normalModeComputed,false);
 for(const [a,b] of g.edges)near(Math.hypot(...g.base[a].map((x,k)=>x-g.base[b][k])),1,2e-7);
 g.points.forEach(([x,y,z],i)=>{near(x,g.base[i][0]);near(y,g.base[i][1]);near(z,1.1*Math.sin(.7*x)*Math.cos(.42*y));});
});
test('Bloch direction is a pure state and the Bell circuit prepares the stated output',()=>{
 const b=models['bloch-sphere'];near(dot(b.state,b.state),1);near(b.state[2],Math.cos(b.theta));near(b.state[0],Math.sin(b.theta)*Math.cos(b.phi));
 const c=models['quantum-circuit'];assert.deepEqual(c.gates,[{gate:'H',target:0},{gate:'CX',control:0,target:1}]);
 let v=[1/Math.sqrt(2),0,1/Math.sqrt(2),0];[v[2],v[3]]=[v[3],v[2]];v.forEach((x,i)=>near(x,c.bellState[i]));
});
test('lattice positions are exact integer combinations of the declared basis',()=>{
 const g=models.lattice;assert.equal(g.points.length,75);
 g.points.forEach((p,i)=>p.forEach((x,k)=>near(x,g.indices[i].reduce((s,n,j)=>s+n*g.basisRows[j][k],0))));
});
test('GBM keeps twelve original sampled paths without smoothing their stochastic increments',()=>{
 const g=models['stochastic-paths'];assert.equal(g.seed,71);assert.equal(g.paths.length,12);assert.equal(g.interpolation,'piecewise linear');
 for(const p of g.paths){assert.equal(p.S.length,100);near(p.S[0],1);for(let i=0;i<100;i++){assert.ok(p.S[i]>0);near(p.S[i],Math.exp((g.mu-.5*g.sigma**2)*p.t[i]+g.sigma*p.W[i]));}}
});
test('density contours and covariance axes follow their matrices',()=>{
 const g=models['gaussian-density'];const density=(x,y)=>Math.exp(-.5*(x*x-1.1*x*y+y*y)/.6975)/(2*Math.PI*Math.sqrt(.6975));
 for(const [x,y,z] of g.points)near(z,9*density(x,y)-.7);
 for(const c of g.contours)for(const [x,y,z] of c.points){near((x*x-1.1*x*y+y*y)/.6975,c.radius**2);near(z,9*density(x,y)-.7+g.heightOffset);}
 const e=models.covariance;
 e.eigenvalues.forEach((value,i)=>{assert.ok(value>0);const v=e.eigenvectors[i];near(dot(v,v),1);matvec(e.covariance,v).forEach((x,k)=>near(x,value*v[k]));});
 // Invert the upper triangular T to recover a point on the unit sphere.
 for(const [x,y,z] of e.points){const c=z/.65,b=(y-.24*c)/.85,a=(x-.5*b-.1*c)/1.6;near(a*a+b*b+c*c,1);}
});
test('finite fractals retain their intended recursive cell counts and open cavities',()=>{
 const s=models.sierpinski;assert.equal(s.depth,3);assert.equal(s.count,64);assert.equal(s.tetrahedra.length,64);
 const m=models.menger;assert.equal(m.depth,2);assert.equal(m.count,400);assert.equal(new Set(m.cells.map(c=>c.join(','))).size,400);
 for(const c of m.cells)for(const scale of [1,3]){const digit=c.map(x=>Math.floor((x+4)/scale)%3);assert.ok(digit.filter(x=>x===1).length<2);}
 const cells=new Set(m.cells.map(c=>c.join(',')));let faces=0;
 for(const c of m.cells)for(let a=0;a<3;a++)for(const s of [-1,1]){const p=[...c];p[a]+=s;if(!cells.has(p.join(',')))faces++;}
 assert.equal(m.exposedFaces,faces);assert.ok(faces<400*6);
});
test('parametric reticles preserve curvature, periodicity and one Mobius boundary',()=>{
 for(const [x,y,z] of models.catenoid.points)near(Math.hypot(x,y),.8*Math.cosh(z/.8));
 for(const [x,y,z] of models.torus.points)near((Math.hypot(x,y)-1)**2+z*z,.38**2);
 for(const [x,y,z] of models.helicoid.points)near(x*Math.sin(z/.23)-y*Math.cos(z/.23),0);
 const b=models.mobius.boundary;b[0].forEach((x,k)=>near(x,b.at(-1)[k]));
 assert.ok(Math.hypot(...b[0].map((x,k)=>x-b[(b.length-1)/2][k]))>.6);
 const j=models.julia;assert.equal(j.planar,true);assert.equal(j.iterations,180);assert.deepEqual(j.c,[-.74543,.11301]);
});
