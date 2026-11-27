// MAIN: keyboard/mouse/gamepad input, the game loop, and start-up. Loads last.
addEventListener('keydown',e=>{if(shop){shopKey(e);return}if(e.code=='KeyF')swing();if(e.code=='KeyT')prog.open('tree');if(e.code=='KeyI')prog.open('inv');if(e.code=='KeyJ')prog.open('jr');if(e.code=='KeyC')prog.toggleSneak();if(e.code=='KeyE')push();if(e.code=='KeyM'){mute=!mute;if(mg)mg.gain.value=mute?0:.5;say(mute?'Sound off':'Sound on',2)}if(e.code=='KeyR'||e.code=='Enter')use();if(e.code=='KeyQ')thr();if(e.code=='KeyZ')lgt();if(e.code=='KeyV')dash()});
hud();
loadPlayer();
// input
const K={};addEventListener('keydown',e=>K[e.code]=1);addEventListener('keyup',e=>K[e.code]=0);
let cy=0,cpch=.45,drag=0,lx=0,ly=0;const dom=ren.domElement;
dom.onpointerdown=e=>{drag=1;lx=e.clientX;ly=e.clientY};addEventListener('pointerup',()=>drag=0);
addEventListener('pointermove',e=>{if(!drag)return;cy-=(e.clientX-lx)*.006;cpch=Math.max(.1,Math.min(1.2,cpch+(e.clientY-ly)*.005));lx=e.clientX;ly=e.clientY});
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;
 let mx=(K.KeyD?1:0)-(K.KeyA?1:0),mz=(K.KeyW?1:0)-(K.KeyS?1:0),jump=K.Space,spr=K.ShiftLeft||K.ShiftRight;
 const gp=[...(navigator.getGamepads?navigator.getGamepads():[])].find(x=>x);
 if(gp){const dz=v=>Math.abs(v)<.2?0:v;mx+=dz(gp.axes[0]);mz-=dz(gp.axes[1]);cy-=dz(gp.axes[2])*2.5*dt;cpch=Math.max(.1,Math.min(1.2,cpch+dz(gp.axes[3])*1.5*dt));jump=jump||gp.buttons[0].pressed;spr=spr||gp.buttons[6].pressed||!!(gp.buttons[10]&&gp.buttons[10].pressed);const bb=gp.buttons.map(z=>z.pressed);if(bb[2]&&!pb[2])swing();if(bb[3]&&!pb[3])push();if(bb[5]&&!pb[5])use();if(!shop){if(bb[9]&&!pb[9])prog.open('tree');if(bb[14]&&!pb[14])prog.open('inv');if(bb[12]&&!pb[12])prog.open('jr');if(bb[8]&&!pb[8])prog.toggleSneak()}if(!shop){if(bb[4]&&!pb[4])thr();if(bb[7]&&!pb[7])lgt();if(bb[1]&&!pb[1])dash()}if(shop){if(bb[12]&&!pb[12])shopMove(-1);if(bb[13]&&!pb[13])shopMove(1);if(bb[0]&&!pb[0])buy();if(bb[1]&&!pb[1])closeShop()}pb=bb}
 if(shop){mx=mz=0;jump=0}const m=Math.hypot(mx,mz),sprN=spr&&!prog.sn&&m>.05&&St.sta>0;St.spr=sprN;if(sprN)St.sta-=25*dt;else St.sta=Math.min(100,St.sta+15*dt*prog.stm());
 if(m>.05){const k=Math.min(1,m),fx=-Math.sin(cy),fz=-Math.cos(cy),rx=Math.cos(cy),rz=-Math.sin(cy),dx=(fx*mz+rx*mx)/m,dz2=(fz*mz+rz*mx)/m,sp=(sprN?12:7)*k*(1+.1*GR.bt+bn('spd'))*prog.spdMul();
  P.x+=dx*sp*dt;P.z+=dz2*sp*dt;const t=Math.atan2(dx,dz2);let d=t-P.f;d=Math.atan2(Math.sin(d),Math.cos(d));P.f+=d*Math.min(1,dt*10)}
 if(St.dash>0){P.x+=Math.sin(P.f)*28*dt;P.z+=Math.cos(P.f)*28*dt;St.dash-=dt}
 for(const c of COL){const dx=P.x-c.x,dz=P.z-c.z,d=Math.hypot(dx,dz);if(d<c.r+.5){P.x=c.x+dx/d*(c.r+.5);P.z=c.z+dz/d*(c.r+.5)}}
 const rr=Math.hypot(P.x,P.z);if(ins){P.x=Math.max(-17.5,Math.min(17.5,P.x));P.z=Math.max(985.5,Math.min(1014.5,P.z))}else if(rr>300){P.x*=300/rr;P.z*=300/rr}
 const gy=ins?0:H(P.x,P.z);if(P.y<=gy+.01&&jump&&P.vy<=0)P.vy=8;P.vy-=22*dt;P.y+=P.vy*dt;if(P.y<gy){P.y=gy;P.vy=0}
 upd(dt);const mv=m>.05&&P.y<=gy+.05&&!shop;walkPh+=dt*(mv?(sprN?14:10):0);const bob=mv?Math.abs(Math.sin(walkPh))*.06:0;pl.position.set(P.x,P.y+bob,P.z);pl.rotation.y=P.f;pl.rotation.z=RG?0:(mv?Math.sin(walkPh)*.03:0);rigPose(dt,mv,sprN);
 const cd=ins?5:9,tx=P.x,ty=P.y+1.6,tz=P.z;cam.position.set(tx+Math.sin(cy)*Math.cos(cpch)*cd,ty+Math.sin(cpch)*cd,tz+Math.cos(cy)*Math.cos(cpch)*cd);
 if(ins){cam.position.x=Math.max(-17.3,Math.min(17.3,cam.position.x));cam.position.z=Math.max(985.7,Math.min(1014.3,cam.position.z))}cam.position.y=Math.max(cam.position.y,(ins?0:H(cam.position.x,cam.position.z))+1);if(ins)cam.position.y=Math.min(cam.position.y,5.4);cam.lookAt(tx,ty,tz);
 sun.position.set(P.x+80,100,P.z+40);sun.target.position.set(P.x,0,P.z);
 for(const s of suns){s.m.visible=!ins;s.m.position.copy(cam.position).add(s.v)}
 const t=now/1000;for(const o of droids){o.d.position.set(o.cx+Math.cos(t*o.s+o.ph)*8,0,o.cz+Math.sin(t*o.s*1.3+o.ph)*8);o.d.rotation.y=-t*o.s}
 document.getElementById('z').textContent=ins?'Mos Eisley Cantina':Math.hypot(P.x-RX,P.z-RZ)<40?'Jedi Ruins':rr<75?'Mos Eisley, Tatooine':'Dune Sea';
 ren.render(S,cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
