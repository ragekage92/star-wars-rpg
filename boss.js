// BOSS: Jedi Ruins, the Trial Master (bolts, slam), enemy projectiles and the victory rewards.
const EBL=[],RX=-60,RZ=-190,BF=document.getElementById('bf');
for(let i=0;i<8;i++){const a=i/8*6.283,x=RX+Math.cos(a)*9,z=RZ+Math.sin(a)*9,h=i%3?7:3.5,pc=new THREE.Mesh(new THREE.CylinderGeometry(.8,.9,h,10),M(0x9aa0a8));pc.position.set(x,H(x,z)+h/2,z);pc.castShadow=true;S.add(pc);COL.push({x,z,r:1.3})}
const alt=new THREE.Mesh(new THREE.BoxGeometry(3,1,3),M(0x7d848c));alt.position.set(RX,H(RX,RZ)+.5,RZ);S.add(alt);COL.push({x:RX,z:RZ,r:2.2});
const kc=new THREE.Mesh(new THREE.OctahedronGeometry(.7),new THREE.MeshBasicMaterial({color:0x66ccff}));kc.position.set(RX,H(RX,RZ)+2,RZ);S.add(kc);label('Jedi Ruins',RX,H(RX,RZ)+10,RZ);
function ebolt(x,z,dx,dz,dm,col){const m=new THREE.Mesh(new THREE.SphereGeometry(.35,8,8),new THREE.MeshBasicMaterial({color:col||0xc66cff}));S.add(m);EBL.push({m,x,z,vx:dx*14,vz:dz*14,t:3,dm:dm||10})}
function ebUpd(dt){for(let i=EBL.length-1;i>=0;i--){const b=EBL[i];b.x+=b.vx*dt;b.z+=b.vz*dt;b.t-=dt;b.m.position.set(b.x,H(b.x,b.z)+1.3,b.z);
 if(!ins&&Math.hypot(b.x-P.x,b.z-P.z)<1.2&&P.y-H(P.x,P.z)<2){hurtP(b.dm);b.t=0}
 if(b.t<=0){S.remove(b.m);EBL.splice(i,1)}}}
function trial(){if(bs==1){say('Defeat the Trial Master!');return}if(bs==2){say('The trial is complete. The Force is strong with you.',4);return}
 bs=1;const g=new THREE.Group(),bm=new THREE.MeshLambertMaterial({color:0x5a2a7a}),b=new THREE.Mesh(new THREE.ConeGeometry(1.1,2.8,12),bm),h=new THREE.Mesh(new THREE.SphereGeometry(.45,12,10),M(0xc9a37a)),sb=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.8,8),new THREE.MeshBasicMaterial({color:0xff3333}));
 b.position.y=1.4;h.position.y=3.1;sb.position.set(.9,1.8,.5);sb.rotation.x=.5;g.add(b,h,sb);S.add(g);
 EN.push({boss:1,g,bm,x:RX,z:RZ+7,hx:RX,hz:RZ,hp:300,mh:300,cd:0,fl:0,sh:2,kx:0,kz:0,dead:0});document.getElementById('bb').style.display='block';say('A Fallen Jedi rises. Face the Trial Master!',5)}
function bossAI(e,dt){e.fl-=dt;e.cd-=dt;e.sh-=dt;e.bm.color.setHex(e.fl>0?0xffffff:0x5a2a7a);BF.style.width=(100*Math.max(0,e.hp)/e.mh)+'%';
 const dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz)||1,p2=e.hp<e.mh/2,safe=ins||Math.hypot(P.x,P.z)<30;
 e.sl=(e.sl===undefined?5:e.sl)-dt;
 if(!safe&&e.tel>0){e.tel-=dt;e.fl=.1;if(e.tel<=0){e.tel=0;ring(e.x,e.z,0xff4040,8);sfx('hit');if(Math.hypot(P.x-e.x,P.z-e.z)<7&&P.y-H(P.x,P.z)<1.5)hurtP(18)}}
 else if(!safe&&d<7&&e.sl<=0){e.tel=.8;e.sl=7;ring(e.x,e.z,0xffaa00,7);say('Slam incoming - get clear!',2)}
 if(!safe){const sp=p2?7.5:5.5;if(e.tel>0){}else if(d>2.4){e.x+=dx/d*sp*dt;e.z+=dz/d*sp*dt}else if(e.cd<=0){hurtP(14);e.cd=1.1}
  if(e.sh<=0&&d<40&&d>4){e.sh=p2?1.8:3;const n=p2?5:3;for(let i=0;i<n;i++){const a=Math.atan2(dx,dz)+(i-(n-1)/2)*.25;ebolt(e.x,e.z,Math.sin(a),Math.cos(a))}}}
 else{const hx=e.hx-e.x,hz=e.hz-e.z,hd=Math.hypot(hx,hz);if(hd>1){e.x+=hx/hd*4*dt;e.z+=hz/hd*4*dt}e.hp=Math.min(e.mh,e.hp+20*dt)}
 e.g.position.set(e.x,H(e.x,e.z),e.z);e.g.rotation.y=Math.atan2(dx,dz)}
function bossWin(e){EN.splice(EN.indexOf(e),1);S.remove(e.g);document.getElementById('bb').style.display='none';bs=2;cr+=300;rob=1;St.xp+=100;
 while(St.xp>=50*St.lv){St.xp-=50*St.lv;St.lv++}St.hp=mhp();if(qa&&QS[qi]&&QS[qi].b)qc=1;
 for(const b of EBL)S.remove(b.m);EBL.length=0;say('Trial complete! +300 credits and Jedi Robes (+20 max HP).',6);prog.trial()}

