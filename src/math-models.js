/* Pure mathematical models, shared by the interactive diagrams and numerical tests. */
(() => {
 const radians=d=>d*Math.PI/180;
 const bloch=(theta,phi)=>{const t=radians(theta),p=radians(phi);return {x:Math.sin(t)*Math.cos(p),y:Math.sin(t)*Math.sin(p),z:Math.cos(t),p0:Math.cos(t/2)**2,p1:Math.sin(t/2)**2};};
 const wave=(x,amplitude,phase)=>({first:Math.cos(x),second:amplitude*Math.cos(x+radians(phase)),sum:Math.cos(x)+amplitude*Math.cos(x+radians(phase))});
 const probability=(x,y)=>1/(1+Math.exp(-(1.2*x-.5*y+.45*x*y)));
 const decision=(x,y,threshold)=>({probability:probability(x,y),classification:probability(x,y)>=threshold?1:0});
 globalThis.MDCMathModels=Object.freeze({bloch,wave,probability,decision});
})();
