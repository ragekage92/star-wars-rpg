// COMBAT: HUD, damage, melee combos, Force push/lightning, saber throw, dash, per-frame update (upd) and enemy AI.
function hud(){HD.textContent='HP '+Math.ceil(St.hp)+'/'+mhp()+' · Lv '+St.lv+' · Kills '+St.k+' · Credits '+cr+' · Stamina '+Math.round(St.sta)+prog.hudTxt();const q=QS[qi];QD.textContent=!q?'All quests done':!qa?'Quest: talk to the Cantina bartender':q.t+' ('+Math.min(qc,q.n)+'/'+q.n+')'+(qc>=q.n?' - return to the bartender':'')}
function say(t,d){MS.textContent=t;St.tt=d||3}
function hit(e,dm,kn,sk){dm=prog.hitMod(e,dm,sk);e.hp-=dm;prog.afterHit(e,dm,sk);e.fl=.12;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz)||1;e.kx=dx/d*kn;e.kz=dz/d*kn;
 if(e.hp<=0&&e.boss){bossWin(e);return}if(e.hp<=0){e.dead=1;e.rt=30;e.g.visible=false;prog.onKill(e);St.k++;cr+=5+Math.floor(Math.random()*6);if(qa&&QS[qi]&&!QS[qi].b)qc++;St.xp+=20;if(St.xp>=50*St.lv){St.xp-=50*St.lv;St.lv++;St.hp=mhp();say('Level '+St.lv+'!')}}}
function swing(){if(shop||St.cd>0)return;const gy=ins?0:H(P.x,P.z),air=P.y>gy+.4,run=St.spr&&!air;
 let k=0;if(air)k=3;else if(run)k=4;else{k=St.ct>0?(St.cmb+1)%3:0;St.cmb=k;St.ct=.9}
 const D=[.35,.35,.65,.5,.5][k]*(prog.pk.s3?.85:1),M2=[1,1.1,1.9,1.4,1.5][k],R2=[3.6,3.6,4.6,4.2,5][k]+(prog.pk.s2?1.2:0),KB=[5,5,13,8,6][k];
 St.cd=D;St.sw=D;St.swd=D;St.swk=k;const fx=Math.sin(P.f),fz=Math.cos(P.f);
 if(k==2||k==4){const L=k==4?4:1.6;P.x+=fx*L;P.z+=fz*L}
 for(const e of [...EN]){if(e.dead)continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz)||1;
  if(d<R2&&(k==3||(dx*fx+dz*fz)/d>(k==4?.6:0)))hit(e,Math.round((14+3*St.lv+4*GR.cry+bn('dmg'))*M2),KB,'saber')}}
function push(){if(shop||St.fc>0)return;St.fc=2*prog.cdm();const m=new THREE.Mesh(new THREE.RingGeometry(.8,1,32),new THREE.MeshBasicMaterial({color:0xa66cff,transparent:true,side:THREE.DoubleSide}));m.rotation.x=-1.57;m.position.set(P.x,P.y+.3,P.z);S.add(m);rings.push({m,t:0});
 for(const e of EN){if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<14)hit(e,10,16,'push')}}
function die(){St.hp=mhp();P.x=0;P.z=16;say('You were knocked out. You wake in Mos Eisley.')}
function upd(dt){
 St.cd-=dt;St.fc-=dt;St.sw-=dt;St.ct-=dt;St.tt-=dt;St.inv-=dt;St.tc-=dt;St.lc-=dt;ebUpd(dt);thUpd(dt);if(St.tt<=0){const nt=near();MS.textContent=nt?'Press R / RB to '+nt:''}
 if(!RG){if(St.sw>0){saber.rotation.x=-1.2+2.4*(1-St.sw/.3);saber.position.set(.55,1.2,.7)}else{saber.rotation.x=.5;saber.position.set(.55,1.2,.35)}}
 for(const r of rings){r.t+=dt;const k=Math.min(1,r.t/.4);r.m.scale.setScalar(1+k*(r.mx||13));r.m.material.opacity=.7*(1-k);if(k>=1)S.remove(r.m)}
 rings=rings.filter(r=>r.t<.4);
 const town=ins||Math.hypot(P.x,P.z)<30;if(town)St.hp=Math.min(mhp(),St.hp+8*dt);
 for(const e of EN){if(e.dead){e.rt-=dt;if(e.rt<=0){e.dead=0;e.hp=40;e.x=e.hx;e.z=e.hz;e.g.visible=true}continue}
  if(e.boss){bossAI(e,dt);continue}e.cd-=dt;e.fl-=dt;e.al=(e.al||0)-dt;e.bm.color.setHex(e.fl>0?0xffffff:(e.gun?0x6a5a7a:0x8a6a48));
  const dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz)||1;
  if(e.kx||e.kz){e.x+=e.kx*dt;e.z+=e.kz*dt;e.kx*=Math.pow(.05,dt);e.kz*=Math.pow(.05,dt);if(Math.abs(e.kx)+Math.abs(e.kz)<.5)e.kx=e.kz=0}
  else if((d<prog.aggro()||(e.al||0)>0)&&!town){
   if(e.gun){e.fc-=dt;if(d<9){e.x-=dx/d*3.5*dt;e.z-=dz/d*3.5*dt}else if(d>16){e.x+=dx/d*4.5*dt;e.z+=dz/d*4.5*dt}if(e.fc<=0&&d<28){e.fc=2.4;ebolt(e.x,e.z,dx/d,dz/d,6,0xff5533)}}
   else if(e.ch>0){e.ch-=dt;e.x+=e.cx*14*dt;e.z+=e.cz*14*dt;if(d<2.2&&e.cd<=0){hurtP(12);e.cd=1.2;e.ch=0}}
   else{e.lc-=dt;if(d>1.8){e.x+=dx/d*4.5*dt;e.z+=dz/d*4.5*dt;if(e.lc<=0&&d>4&&d<10){e.ch=.4;e.cx=dx/d;e.cz=dz/d;e.lc=6}}else if(e.cd<=0){hurtP(8);e.cd=1.2}}}
  else{const hx=e.hx-e.x,hz=e.hz-e.z,hd=Math.hypot(hx,hz);if(hd>1){e.x+=hx/hd*3*dt;e.z+=hz/hd*3*dt}}
  e.g.position.set(e.x,H(e.x,e.z),e.z);e.g.rotation.y=Math.atan2(dx,dz)}
 hud()}
function thr(){if(shop||ins||St.tc>0)return;St.tc=3*prog.cdm();const m=new THREE.Group(),c=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.4,8),new THREE.MeshBasicMaterial({color:0x66ccff}));c.rotation.z=1.57;m.add(c);S.add(m);TH={m,t:0,hit:new Set(),fx:Math.sin(P.f),fz:Math.cos(P.f)}}
function lgt(){if(shop||ins||St.lc>0)return;St.lc=2.5*prog.cdm();const fx=Math.sin(P.f),fz=Math.cos(P.f);
 for(const e of [...EN]){if(e.dead)continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz)||1;if(d<14&&(dx*fx+dz*fz)/d>.5){const ex=e.x,ez=e.z;hit(e,8+2*St.lv,2,'zap');
  const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(P.x,P.y+1.4,P.z),new THREE.Vector3(ex,P.y+1.2,ez)]),new THREE.LineBasicMaterial({color:0xcaa6ff}));S.add(l);FXL.push({l,t:.25})}}}
function dash(){if(shop||ins||St.dash>0||St.sta<20)return;St.dash=.18;St.inv=.3;St.sta-=20}
function thUpd(dt){if(TH){TH.t+=dt;if(TH.t>=1.2){S.remove(TH.m);TH=null}else{const d=12*Math.sin(Math.PI*TH.t/1.2),x=P.x+TH.fx*d,z=P.z+TH.fz*d;TH.m.position.set(x,P.y+1.2,z);TH.m.rotation.y+=dt*25;if(!TH.h2&&TH.t>.6){TH.h2=1;TH.hit.clear()}
  for(const e of [...EN]){if(!e.dead&&!TH.hit.has(e)&&Math.hypot(e.x-x,e.z-z)<2.2){TH.hit.add(e);hit(e,10+3*St.lv+4*GR.cry+bn('dmg'),3,'saber')}}}}
 for(let i=FXL.length-1;i>=0;i--){FXL[i].t-=dt;if(FXL[i].t<=0){S.remove(FXL[i].l);FXL.splice(i,1)}}}
function hurtP(n){if(St.inv<=0)St.hp-=prog.absorb(Math.max(1,n-2*GR.arm-bn('arm')));if(St.hp<=0)die()}
function ring(x,z,col,mx){const m=new THREE.Mesh(new THREE.RingGeometry(.8,1,32),new THREE.MeshBasicMaterial({color:col,transparent:true,side:THREE.DoubleSide}));m.rotation.x=-1.57;m.position.set(x,(ins?0:H(x,z))+.3,z);S.add(m);rings.push({m,t:0,mx})}
