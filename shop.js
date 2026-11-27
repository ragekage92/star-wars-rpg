// SHOP: the Trader, his stock, buying logic and menu.
const GR={cry:0,arm:0,bt:0},SH=[{n:'Kyber Crystal',k:'cry',c:80,d:'+4 saber damage per level'},{n:'Padded Armor',k:'arm',c:60,d:'-2 damage taken per level'},{n:'Speeder Boots',k:'bt',c:70,d:'+10% move speed per level'},{n:'Medpac',k:'med',c:20,d:'Restores full HP',u:1}];
const price=s=>Math.ceil((s.u?s.c:s.c*(GR[s.k]+1))*prog.disc());
function shopR(){const el=document.getElementById('sh');el.style.display=shop?'block':'none';if(!shop)return;
 el.innerHTML='<b>Trader</b> · Credits '+cr+'<br><br>'+SH.map((s,i)=>'<div onclick="sel='+i+';buy()" style="padding:6px 8px;border-radius:6px;cursor:pointer;background:'+(i==sel?'#4a6fd0':'transparent')+'"><b>'+s.n+(s.u?'':' (Lv '+GR[s.k]+'/3)')+'</b><br><span style="font-size:12px;opacity:.8">'+s.d+' · '+(!s.u&&GR[s.k]>=3?'MAX':price(s)+' cr')+'</span></div>').join('')+'<br><span style="font-size:11px;opacity:.7">Up/Down + Enter or A to buy · R or B to leave</span>';const rr=el.children&&el.children[3+sel];if(rr&&rr.scrollIntoView)rr.scrollIntoView({block:'nearest'})}
function buy(){if(prog.ui){prog.ok();return}const s=SH[sel];if(s.it){prog.buyItem(s);return}if(!s.u&&GR[s.k]>=3){say('Already maxed out.');return}const p=price(s);if(cr<p){say('Not enough credits.');return}cr-=p;if(s.k=='med')St.hp=mhp();else GR[s.k]++;say('Bought '+s.n+'.');shopR()}
function shopMove(d){if(prog.ui){prog.nav(d);return}sel=(sel+d+SH.length)%SH.length;shopR()}
function closeShop(){if(prog.ui){prog.close();return}shop=0;shopR()}
function shopKey(e){if(prog.ui){prog.key(e);return}if(e.code=='ArrowUp')shopMove(-1);if(e.code=='ArrowDown')shopMove(1);if(e.code=='Enter')buy();if(e.code=='Escape'||e.code=='KeyR')closeShop()}
const tr=new THREE.Group(),trb=new THREE.Mesh(new THREE.CylinderGeometry(.4,.5,1.5,8),M(0x4a8a5a)),trh=new THREE.Mesh(new THREE.SphereGeometry(.32,10,8),M(0x6aa84f));trb.position.y=.8;trh.position.y=1.8;tr.add(trb,trh);tr.position.set(12,0,-3);IN.add(tr);
const crt=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.2,1.4),M(0x7a5a3a));crt.position.set(13.5,.6,-4.5);IN.add(crt);COL.push({x:13.5,z:995.5,r:1.2},{x:12,z:997,r:.8});label('Trader',12,5.4,997);
