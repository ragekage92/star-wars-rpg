// RIG: bends/moves the model's mesh in code (arms, legs, spine) and keeps the saber in his hand.
let RG=null,plPv=null;const RS={mvf:0,lean:0,atk:0,tw:0};
const _q=new THREE.Quaternion(),_r0=new THREE.Vector3(),_vv=new THREE.Vector3(),_Y=new THREE.Vector3(0,1,0);
const smt=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
function armM(sg,d){_r0.set(.789*sg,-.615,0);_vv.copy(d).normalize();_q.setFromUnitVectors(_r0,_vv);return new THREE.Matrix4().makeRotationFromQuaternion(_q).elements}
function rigInit(m){let mesh=null;m.traverse(o=>{if(o.isMesh&&!mesh)mesh=o});if(!mesh)return;
 const pa=mesh.geometry.attributes.position,n=pa.count,o0=new Float32Array(pa.array),wa=[new Float32Array(n),new Float32Array(n)],wl=[new Float32Array(n),new Float32Array(n)],wb=new Float32Array(n);
 for(let i=0;i<n;i++){const x=o0[i*3],y=o0[i*3+1];
  for(let s=0;s<2;s++){const ax=s?-x:x,dx=ax-.28,dy=y-.52,t=(dx*.5-dy*.39)/.4021,px=dx-t*.5,py=dy+t*.39;
   wa[s][i]=smt(.08,.4,t)*(1-smt(.2,.3,Math.hypot(px,py)));wl[s][i]=smt(-.3,-.6,y)*smt(-.06,.06,ax)}
  wb[i]=smt(-.2,.5,y)}
 RG={pa,o0,wa,wl,wb,n,H0:[-.78,.13,.02]}}
function rigPose(dt,mv,spr){if(!RG||!plPv)return;
 const ph=walkPh,tt=performance.now()/1000,k=St.swk,atk=St.sw>0,p=atk?Math.min(1,Math.max(0,1-St.sw/St.swd)):0,e=p*p*(3-2*p),K=Math.min(1,dt*8);
 RS.mvf+=((mv?1:0)-RS.mvf)*K;RS.atk+=((atk?1:0)-RS.atk)*Math.min(1,dt*14);const f=RS.mvf,A=RS.atk;
 const V=(o,y,z)=>new THREE.Vector3(-o,y,z);
 const d=V(.22,-.3,.9);
 if(atk){let tg;if(k==3)tg=V(.95,.05,.1);else{const S0=[V(.95,.35,.05),V(-.5,.1,.8),V(.1,1,.1),0,V(.15,-.05,1)][k],E0=[V(-.5,-.25,.85),V(.9,-.2,.4),V(.1,-.5,.9),0,V(.15,-.05,1)][k];tg=S0.clone().lerp(E0,e)}d.lerp(tg,A)}
 d.y+=Math.sin(ph)*.05*f;
 const dL=new THREE.Vector3(.28,-.9,.15+Math.sin(ph+3.14)*.5*f).lerp(new THREE.Vector3(.9,.15,-.35),k==3?0:A);
 const al=Math.sin(ph)*(spr?.6:.42)*f;
 const tl=f*(spr?.2:.09)+(prog.sn?.28:0)+(atk?[.1,.1,.35,0,.3][k]*Math.sin(Math.PI*p):0)+Math.sin(tt*1.5)*.015;RS.lean+=(tl-RS.lean)*Math.min(1,dt*12);const th=RS.lean;
 if(atk&&k==3)RS.tw=p*6.283;else{if(RS.tw>3.14)RS.tw-=6.283;const tg=atk?(k==0?.5-e:k==1?-.5+e:0):0;RS.tw+=(tg-RS.tw)*Math.min(1,dt*14)}
 plPv.rotation.y=RS.tw;
 const MR=armM(-1,d),ML=armM(1,dL),o=RG.o0,pa=RG.pa.array,wa0=RG.wa[0],wa1=RG.wa[1],wl0=RG.wl[0],wl1=RG.wl[1],wb=RG.wb;
 for(let i=0;i<RG.n;i++){let x=o[i*3],y=o[i*3+1],z=o[i*3+2],w=wa1[i],nx,ny,nz,rx,ry;
  if(w>0){rx=x+.28;ry=y-.52;nx=MR[0]*rx+MR[4]*ry+MR[8]*z-.28;ny=MR[1]*rx+MR[5]*ry+MR[9]*z+.52;nz=MR[2]*rx+MR[6]*ry+MR[10]*z;x+=w*(nx-x);y+=w*(ny-y);z+=w*(nz-z)}
  w=wa0[i];if(w>0){rx=x-.28;ry=y-.52;nx=ML[0]*rx+ML[4]*ry+ML[8]*z+.28;ny=ML[1]*rx+ML[5]*ry+ML[9]*z+.52;nz=ML[2]*rx+ML[6]*ry+ML[10]*z;x+=w*(nx-x);y+=w*(ny-y);z+=w*(nz-z)}
  const a=th*wb[i];if(a!==0){const c=Math.cos(a),s=Math.sin(a),yy=y+.1;y=yy*c-z*s-.1;z=yy*s+z*c}
  const lw=wl0[i]-wl1[i];if(lw!==0){const a2=al*lw,c=Math.cos(a2),s=Math.sin(a2),yy=y+.1;y=yy*c-z*s-.1;z=yy*s+z*c}
  pa[i*3]=x;pa[i*3+1]=y;pa[i*3+2]=z}
 RG.pa.needsUpdate=true;
 // saber follows the right hand
 const H0=RG.H0,rx=H0[0]+.28,ry=H0[1]-.52,rz=H0[2];
 let hx=MR[0]*rx+MR[4]*ry+MR[8]*rz-.28,hy=MR[1]*rx+MR[5]*ry+MR[9]*rz+.52,hz=MR[2]*rx+MR[6]*ry+MR[10]*rz;
 const ab=th*smt(-.2,.5,H0[1]),cb=Math.cos(ab),sb=Math.sin(ab),yy=hy+.1,hy2=yy*cb-hz*sb-.1,hz2=yy*sb+hz*cb;
 saber.position.set(hx*plModel.scale.x+plModel.position.x,hy2*plModel.scale.x+plModel.position.y,hz2*plModel.scale.x+plModel.position.z);
 const Bd=new THREE.Vector3(.05,1,.35).lerp(d.clone().add(new THREE.Vector3(0,.3,0)),A).normalize();saber.quaternion.setFromUnitVectors(_Y,Bd)}
