// PROGRESSION: light/dark side, companions + influence, Skyrim-style skills & perks (incl. Sneak), items/equipment/loot, and their menus.
const SKN={saber:'Lightsaber',force:'Force',sneak:'Sneak',speech:'Speech'},SLOT={w:'Crystal',a:'Armor',g:'Gloves',b:'Boots',m:'Amulet'},RC=['#ddd','#6f6','#6af','#c8f'];
const ITEMS={
 kyb1:{n:'Blue Kyber Crystal',s:'w',st:{dmg:3},c:90,r:0,shop:1,d:'+3 damage'},
 kyb2:{n:'Green Kyber Crystal',s:'w',st:{dmg:5},c:170,r:1,shop:1,d:'+5 damage'},
 kyb3:{n:'Red Synthetic Crystal',s:'w',st:{dmg:7,force:.1},c:260,r:2,d:'+7 damage, +10% Force power'},
 arm1:{n:'Padded Robes',s:'a',st:{arm:1,hp:10},c:60,r:0,shop:1,d:'-1 damage taken, +10 HP'},
 arm2:{n:'Scout Armor',s:'a',st:{arm:2,hp:15},c:120,r:1,shop:1,d:'-2 damage taken, +15 HP'},
 arm3:{n:'Beskar Plate',s:'a',st:{arm:4,hp:25},c:320,r:2,shop:1,d:'-4 damage taken, +25 HP'},
 arm4:{n:'Jedi Master Robes',s:'a',st:{arm:2,hp:30,force:.15},c:0,r:3,d:'-2 damage, +30 HP, +15% Force power'},
 arm5:{n:'Sith Battle Robes',s:'a',st:{arm:2,hp:20,force:.2,dmg:3},c:0,r:3,d:'-2 damage, +20 HP, +20% Force, +3 damage'},
 glv1:{n:'Force Gloves',s:'g',st:{force:.1},c:90,r:0,shop:1,d:'+10% Force power'},
 glv2:{n:'Duelist Gloves',s:'g',st:{dmg:2},c:100,r:1,d:'+2 damage'},
 bt1:{n:'Shadow Boots',s:'b',st:{spd:.05},c:110,r:1,shop:1,d:'+5% speed'},
 bt2:{n:'Sprinter Boots',s:'b',st:{spd:.12},c:150,r:1,d:'+12% speed'},
 am1:{n:'Holocron Amulet',s:'m',st:{xp:.15},c:150,r:1,shop:1,d:'+15% skill XP'},
 am2:{n:'Vitality Amulet',s:'m',st:{hp:30},c:140,r:1,d:'+30 HP'},
 am3:{n:'Silver Tongue Pendant',s:'m',st:{disc:.1},c:130,r:1,d:'-10% shop prices'},
 med1:{n:'Field Medpac',s:'u',c:25,r:0,shop:1,d:'Heal 50 HP',use(){St.hp=Math.min(mhp(),St.hp+50)}},
 med2:{n:'Large Medpac',s:'u',c:60,r:1,shop:1,d:'Heal to full',use(){St.hp=mhp()}},
 shd:{n:'Shield Cell',s:'u',c:50,r:1,shop:1,d:'Absorb 30 damage for 20s',use(){prog.sh=30;prog.sht=20}},
 stm:{n:'Combat Stim',s:'u',c:45,r:1,shop:1,d:'+50% damage for 25s',use(){prog.stim=25}},
 ton:{n:'Stamina Tonic',s:'u',c:30,r:0,shop:1,d:'Refill stamina',use(){St.sta=100}}};
const PERKS=[
 {id:'s1',sk:'saber',lv:3,n:'Keen Edge',d:'+20% saber damage'},{id:'s2',sk:'saber',lv:8,n:'Cleave',d:'wider saber swings'},{id:'s3',sk:'saber',lv:14,n:'Duelist Tempo',d:'15% faster swings'},
 {id:'f1',sk:'force',lv:3,n:'Focus',d:'Force and throw cooldowns -20%'},{id:'f2',sk:'force',lv:8,n:'Amplify',d:'+25% Force damage'},{id:'f3',sk:'force',lv:14,n:'Meditation',d:'stamina refills 60% faster'},
 {id:'k1',sk:'sneak',lv:3,n:'Light Step',d:'sneak faster, enemies spot you from less far, silent steps'},{id:'k2',sk:'sneak',lv:8,n:'Backstab',d:'sneak attacks do triple damage'},{id:'k3',sk:'sneak',lv:14,n:'Shadow',d:'enemies barely notice you while sneaking'},
 {id:'p1',sk:'speech',lv:3,n:'Haggler',d:'shop prices -10%'},{id:'p2',sk:'speech',lv:8,n:'Silver Tongue',d:'quest rewards +25%'},{id:'p3',sk:'speech',lv:14,n:'Inspiring',d:'companions approve 50% more'}];
const LINES={juno:['I have seen what power does to people. Careful.','Smuggling taught me to read people. You are hard to read.','You are one of the good ones, you know that?','Wherever this goes, I am with you.'],
 kx:['Query: why do you hesitate, meatbag? Mercy is a malfunction.','Statement: you are adequate for a Jedi.','Statement: your methods are efficient. I approve.','Statement: I would terminate anything that threatens you.']};
const PG=document.getElementById('pg');
const prog={ui:null,sel:0,rows:[],opts:[],title:'',sn:0,al:0,inv:{},eq:{},pk:{},sh:0,sht:0,stim:0,sneakHit:0,wp:0,
 sk:{saber:{lv:1,xp:0},force:{lv:1,xp:0},sneak:{lv:1,xp:0},speech:{lv:1,xp:0}},
 comp:{juno:{n:'Juno',inf:0,rec:0,hx:-9.5,hz:1003,x:-9.5,z:1003,cd:0,hc:0,col:0xd9a34a,bolt:0x66ccff},kx:{n:'KX-9',inf:0,rec:0,hx:-9.5,hz:998.5,x:-9.5,z:998.5,cd:0,hc:0,col:0x777c84,bolt:0xff4a3a}},
 cb:[],
 // ---- alignment
 shift(a){prog.al=Math.max(-100,Math.min(100,prog.al+a));prog.col();if(a)say((a>0?'Light side +':'Dark side +')+Math.abs(a),2)},
 col(){if(saber&&saber.material)saber.material.color.setHex(prog.al>=30?0x44ff88:prog.al<=-30?0xff3333:0x66ccff)},
 alText(){return prog.al>=30?'Light '+prog.al:prog.al<=-30?'Dark '+(-prog.al):'Neutral '+prog.al},
 hudTxt(){return (prog.sn?' \u00b7 Sneaking':'')+' \u00b7 '+prog.alText()},
 // ---- companions
 ap(j,k){for(const [id,d] of [['juno',j],['kx',k]]){const c=prog.comp[id];if(!c.rec||!d)continue;const v=d>0?d*(prog.pk.p3?1.5:1):d;c.inf=Math.max(-100,Math.min(100,Math.round(c.inf+v)));say(c.n+(d>0?' approves.':' disapproves.'),2.5)}},
 line(k){const c=prog.comp[k];return LINES[k][c.inf<0?0:c.inf<25?1:c.inf<60?2:3]},
 recruit(k){const c=prog.comp[k];c.rec=1;c.x=P.x;c.z=P.z;say(c.n+' joins you.',3);prog.xp('speech',5)},
 dismiss(k){const c=prog.comp[k];c.rec=0;c.x=c.hx;c.z=c.hz;say(c.n+' will wait in the Cantina.',3)},
 near(){if(!ins)return'';for(const k in prog.comp){const c=prog.comp[k];if(!c.rec&&Math.hypot(P.x-c.hx,P.z-c.hz)<3.5)return'talk to '+c.n}return''},
 use(){if(!ins)return false;for(const k in prog.comp){const c=prog.comp[k];if(!c.rec&&Math.hypot(P.x-c.hx,P.z-c.hz)<3.5){prog.choice(c.n+': "'+prog.line(k)+'"',[{t:'Join me',f:()=>prog.recruit(k)},{t:'Chat',f:()=>{say(c.n+': '+prog.line(k),5);prog.xp('speech',3)}},{t:'Not now',f:()=>{}}]);return true}}return false},
 compMenu(k){const c=prog.comp[k];if(!c.rec){say('Find '+c.n+' in the Cantina to recruit them.',3);return}prog.choice(c.n+' (influence '+c.inf+')',[{t:'Chat',f:()=>say(c.n+': '+prog.line(k),6)},{t:'Ask them to wait in the Cantina',f:()=>prog.dismiss(k)},{t:'Never mind',f:()=>{}}])},
 // ---- choices that move alignment and influence
 reward(q){const m=1+(prog.pk.p2?.25:0);prog.xp('speech',15);prog.choice('"'+q.t+'" is done. The bartender owes you. How do you handle it?',[
  {t:'Take the agreed pay ('+Math.round(q.r*m)+' cr)',f:()=>{cr+=Math.round(q.r*m);prog.shift(4);prog.ap(3,-2)}},
  {t:'Demand double or you will make trouble ('+Math.round(q.r*2*m)+' cr)',f:()=>{cr+=Math.round(q.r*2*m);prog.shift(-8);prog.ap(-6,6)}},
  {t:'Refuse the pay, he needs it more',f:()=>{prog.shift(12);prog.ap(8,-4)}}])},
 trial(){prog.choice('The Trial Master kneels, beaten. What do you do?',[
  {t:'Spare him (Light side)',f:()=>{prog.shift(20);prog.ap(10,-8);prog.give('arm4');say('The Master bows and fades away. Found: Jedi Master Robes.',5)}},
  {t:'Strike him down (Dark side)',f:()=>{prog.shift(-20);prog.ap(-10,10);prog.give('arm5');say('Dark power surges through you. Found: Sith Battle Robes.',5)}}])},
 // ---- skills and perks
 xp(k,a){const s=prog.sk[k];if(s.lv>=20)return;s.xp+=a*(1+bn('xp'));const need=30+20*s.lv;if(s.xp>=need){s.xp-=need;s.lv++;say(SKN[k]+' increased to '+s.lv+'!',3);sfx('level')}},
 pts(){return Math.max(0,St.lv-1)-Object.keys(prog.pk).length},
 learn(p){if(prog.pk[p.id]){say('Already learned.');return}if(prog.sk[p.sk].lv<p.lv){say('Needs '+SKN[p.sk]+' '+p.lv+'.');return}if(prog.pts()<=0){say('No perk points. Level up to earn more.');return}prog.pk[p.id]=1;say('Learned '+p.n+'!',3);sfx('level');prog.render()},
 aggro(){return prog.sn?(prog.pk.k3?6:prog.pk.k1?10:14):35},
 spdMul(){return prog.sn?(prog.pk.k1?.75:.55):1},
 cdm(){return prog.pk.f1?.8:1},stm(){return prog.pk.f3?1.6:1},
 disc(){return Math.max(.4,1-bn('disc')-(prog.pk.p1?.1:0)-.005*(prog.sk.speech.lv-1))},
 toggleSneak(){if(shop)return;prog.sn=!prog.sn;say(prog.sn?'Sneaking (C to stand)':'Standing',1.5)},
 // ---- combat hooks
 hitMod(e,dm,sk){if(sk=='comp'||!sk)return dm;const f=sk=='saber'?'saber':'force';let m=1+(f=='saber'?.02:.03)*(prog.sk[f].lv-1);
  if(f=='saber'&&prog.pk.s1)m*=1.2;if(f=='force'){if(prog.pk.f2)m*=1.25;m*=1+bn('force')}
  if(prog.stim>0)m*=1.5;if(sk=='zap'&&prog.al<=-30)m*=1.5;if(sk=='push'&&prog.al>=30)m*=1.3;
  if(prog.sn&&(e.al||0)<=0&&!e.boss){m*=prog.pk.k2?3:2;prog.sneakHit=1}
  return Math.max(1,Math.round(dm*m))},
 afterHit(e,dm,sk){if(sk&&sk!='comp')prog.xp(sk=='saber'?'saber':'force',4);if(prog.sneakHit){prog.sneakHit=0;prog.xp('sneak',12);say('Sneak attack!',2)}e.al=6;
  if(sk=='zap'&&prog.al<=-30)St.hp=Math.min(mhp(),St.hp+Math.round(dm*.3));if(sk=='push'&&prog.al>=30)St.hp=Math.min(mhp(),St.hp+3)},
 absorb(d){if(prog.sh>0){const t=Math.min(prog.sh,d);prog.sh-=t;return d-t}return d},
 onKill(e){if(e.boss||Math.random()>=.28)return;const r=Math.random(),rar=r<.55?0:r<.85?1:r<.97?2:3;let pool=Object.keys(ITEMS).filter(k=>ITEMS[k].r==rar&&ITEMS[k].c!==0);if(!pool.length)pool=Object.keys(ITEMS).filter(k=>ITEMS[k].r==0);const id=pool[Math.floor(Math.random()*pool.length)];prog.give(id);say('Found: '+ITEMS[id].n,3)},
 // ---- items
 give(id,n){prog.inv[id]=(prog.inv[id]||0)+(n||1)},
 equip(id){const it=ITEMS[id];if(it.s=='u'){if(!(prog.inv[id]>0))return;prog.inv[id]--;it.use();say('Used '+it.n+'.',2)}else{prog.eq[it.s]=id;St.hp=Math.min(St.hp,mhp());say('Equipped '+it.n+'.',2)}prog.render()},
 buyItem(s){const p=price(s);if(cr<p){say('Not enough credits.');return}cr-=p;prog.give(s.it);prog.xp('speech',6);say('Bought '+s.n+'. Open your inventory with I.',3);shopR()},
 // ---- per-frame
 tick(dt){prog.sht-=dt;if(prog.sht<=0)prog.sh=0;prog.stim-=dt;
  if(prog.sn&&walkPh!==prog.wp&&EN.some(e=>!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<35))prog.xp('sneak',.6*dt*10);prog.wp=walkPh;
  for(const k in prog.comp){const c=prog.comp[k];if(!c.g)continue;
   if(!c.rec){c.g.position.set(c.hx,0,c.hz);continue}
   const sd=k=='juno'?-1.6:1.6,tx=P.x-Math.sin(P.f)*2.4+sd*Math.cos(P.f),tz=P.z-Math.cos(P.f)*2.4-sd*Math.sin(P.f);
   c.x+=(tx-c.x)*Math.min(1,dt*3.5);c.z+=(tz-c.z)*Math.min(1,dt*3.5);if(Math.hypot(c.x-P.x,c.z-P.z)>14){c.x=tx;c.z=tz}
   c.g.position.set(c.x,ins?0:H(c.x,c.z),c.z);c.g.rotation.y=P.f;
   c.cd-=dt;if(c.cd<=0&&!ins){let best=null,bd=18;for(const e of EN){if(e.dead)continue;const d=Math.hypot(e.x-c.x,e.z-c.z);if(d<bd){bd=d;best=e}}
    if(best){c.cd=k=='kx'?1.1:1.5;const dx=best.x-c.x,dz=best.z-c.z,dd=Math.hypot(dx,dz)||1,n=(k=='kx'&&c.inf>=60)?2:1,dm=(k=='kx'&&c.inf>=25?10:6)+St.lv;
     for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.22,6,6),new THREE.MeshBasicMaterial({color:c.bolt}));S.add(m);prog.cb.push({m,x:c.x,z:c.z,vx:dx/dd*22,vz:dz/dd*22,t:1.2+i*.0,dm,d:i*.12})}}}
   if(k=='juno'&&c.inf>=25){c.hc-=dt;if(c.hc<=0&&St.hp<mhp()*.7){c.hc=20;St.hp=Math.min(mhp(),St.hp+15);say('Juno patches you up.',2)}}}
  for(let i=prog.cb.length-1;i>=0;i--){const b=prog.cb[i];if(b.d>0){b.d-=dt;continue}b.x+=b.vx*dt;b.z+=b.vz*dt;b.t-=dt;b.m.position.set(b.x,(ins?0:H(b.x,b.z))+1.2,b.z);
   for(const e of EN){if(!e.dead&&Math.hypot(e.x-b.x,e.z-b.z)<1.3){hit(e,b.dm,2,'comp');b.t=0;break}}
   if(b.t<=0){S.remove(b.m);prog.cb.splice(i,1)}}},
 // ---- menus
 open(n){if(shop)return;prog.ui=n;shop=1;prog.sel=0;prog.render()},
 choice(t,o){prog.title=t;prog.opts=o;prog.ui='choice';shop=1;prog.sel=0;prog.render()},
 close(){if(prog.ui=='choice')return;prog.ui=null;shop=0;PG.style.display='none'},
 pick(o){prog.ui=null;shop=0;PG.style.display='none';o.f()},
 nav(d){const n=prog.rows.length;if(n)prog.sel=(prog.sel+d+n)%n;prog.render()},
 ok(){const r=prog.rows[prog.sel];if(r)r()},
 key(e){if(e.code=='ArrowUp')prog.nav(-1);else if(e.code=='ArrowDown')prog.nav(1);else if(e.code=='Enter'||e.code=='Space')prog.ok();else if(e.code=='Escape'||e.code=='KeyR'||e.code=='KeyT'||e.code=='KeyI'||e.code=='KeyJ')prog.close()},
 render(){if(!prog.ui){PG.style.display='none';return}PG.style.display='block';const rows=[];let h='';
  const row=(html,f)=>{const i=rows.length;rows.push(f);return '<div onclick="prog.sel='+i+';prog.ok()" style="padding:5px 8px;border-radius:6px;cursor:pointer;background:'+(i==prog.sel?'#4a6fd0':'transparent')+'">'+html+'</div>'};
  const small=t=>'<span style="font-size:11px;opacity:.75">'+t+'</span>';
  if(prog.ui=='tree'){h='<b>Skills &amp; perks</b> \u00b7 Perk points: '+prog.pts()+'<br>'+small('Skills level as you use them. Up/Down + Enter to learn \u00b7 T or B to close')+'<br>';
   for(const k in prog.sk){const s=prog.sk[k];h+='<div style="margin-top:8px"><b>'+SKN[k]+' '+s.lv+'</b> '+small(Math.floor(s.xp)+'/'+(30+20*s.lv)+' xp')+'</div>';
    for(const p of PERKS.filter(p=>p.sk==k)){const own=prog.pk[p.id];h+=row('<b>'+(own?'[Learned] ':'')+p.n+'</b> '+small(p.d+(own?'':' \u00b7 needs '+SKN[k]+' '+p.lv)),()=>prog.learn(p))}}}
  else if(prog.ui=='inv'){h='<b>Inventory</b> \u00b7 Credits '+cr+'<br>'+small('Enter to equip or use \u00b7 I or B to close')+'<div style="margin:6px 0">'+small('Equipped: '+Object.keys(SLOT).map(s=>SLOT[s]+' '+(prog.eq[s]?ITEMS[prog.eq[s]].n:'-')).join(' \u00b7 '))+'<br>'+small('Bonus: +'+bn('dmg')+' dmg, -'+bn('arm')+' damage taken, +'+bn('hp')+' HP, +'+Math.round(bn('force')*100)+'% Force, +'+Math.round(bn('spd')*100)+'% speed')+'</div>';
   const ids=Object.keys(prog.inv).filter(id=>prog.inv[id]>0);if(!ids.length)h+='<i>Empty. Buy gear from the Trader or loot raiders.</i>';
   for(const id of ids){const it=ITEMS[id],on=prog.eq[it.s]==id;h+=row('<b style="color:'+RC[it.r]+'">'+it.n+'</b>'+(it.s=='u'?' x'+prog.inv[id]:'')+(on?' [Equipped]':'')+' '+small(it.d),()=>prog.equip(id))}}
  else if(prog.ui=='jr'){const q=QS[qi];h='<b>Journal</b> '+small('J or B to close')+'<br><br>Alignment: <b>'+prog.alText()+'</b><div style="position:relative;height:8px;margin:6px 0 10px;background:linear-gradient(90deg,#c33,#888,#4c8)"><div style="position:absolute;top:-3px;width:4px;height:14px;background:#fff;left:'+((prog.al+100)/2)+'%"></div></div>'+small('Dark: stronger lightning that drains life \u00b7 Light: stronger push that heals you. Saber color changes.')+'<br><br><b>Companions</b>';
   for(const k in prog.comp){const c=prog.comp[k];h+=row('<b>'+c.n+'</b> \u00b7 '+(c.rec?'With you':'In the Cantina')+' \u00b7 Influence '+c.inf,()=>prog.compMenu(k))}
   h+='<br>'+small('Current quest: '+(q?(qa?q.t:'talk to the bartender'):'none'))}
  else if(prog.ui=='choice'){h='<b>'+prog.title+'</b><br><br>';prog.opts.forEach(o=>{h+=row(o.t,()=>prog.pick(o))})}
  prog.rows=rows;if(prog.sel>=rows.length)prog.sel=0;PG.innerHTML=h;
  const r=PG.children&&PG.querySelectorAll?PG.querySelectorAll('[onclick]')[prog.sel]:null;if(r&&r.scrollIntoView)r.scrollIntoView({block:'nearest'})}};
// companions in the Cantina
function mkComp(c,k){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.35,.45,1.4,8),M(c.col)),h=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),M(k=='kx'?0xaa2222:0xd9a37a));b.position.y=.75;h.position.y=1.7;g.add(b,h);S.add(g);
 label(c.n,0,3,0);const sp=S.children[S.children.length-1];g.add(sp);sp.position.set(0,3,0);c.g=g;g.position.set(c.hx,0,c.hz)}
for(const k in prog.comp)mkComp(prog.comp[k],k);
// bonuses from equipped items (and Juno's friendship)
function bn(k){let t=0;for(const s in prog.eq){const it=ITEMS[prog.eq[s]];if(it&&it.st&&it.st[k])t+=it.st[k]}return t}
// the Trader sells gear too
for(const id in ITEMS){const it=ITEMS[id];if(it.shop)SH.push({n:it.n,k:id,c:it.c,d:it.d,u:1,it:id})}
