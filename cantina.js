// CANTINA: the interior room, bartender, quests, and the use/enter/leave interaction code.
const QD=document.getElementById('q'),QS=[{t:'Defeat 3 raiders',n:3,r:50},{t:'Defeat 6 raiders',n:6,r:100},{t:'Defeat 10 raiders',n:10,r:200},{t:'Complete the Jedi Trial at the ruins',n:1,r:400,b:1}];
const IN=new THREE.Group();IN.position.set(0,0,1000);S.add(IN);
const fl=new THREE.Mesh(new THREE.BoxGeometry(36,.4,30),new THREE.MeshLambertMaterial({color:0x6a4a30,map:tex(255,255,255,110,6)}));fl.position.y=-.2;fl.receiveShadow=true;IN.add(fl);
[[0,-15,36,.6],[0,15,36,.6],[-18,0,.6,30],[18,0,.6,30]].forEach(w=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w[2],6,w[3]),sand);m.position.set(w[0],3,w[1]);IN.add(m)});
const roof=new THREE.Mesh(new THREE.BoxGeometry(36,.5,30),M(0x6a523a));roof.position.y=6.2;IN.add(roof);
const bar=new THREE.Mesh(new THREE.BoxGeometry(36,1.2,1.6),M(0x7a5535));bar.position.set(0,.6,-8);IN.add(bar);for(let i=-17;i<=17;i+=2)COL.push({x:i,z:992,r:1.1});
const bt=new THREE.Group(),btb=new THREE.Mesh(new THREE.CylinderGeometry(.4,.5,1.5,8),M(0xb8863a)),bth=new THREE.Mesh(new THREE.SphereGeometry(.32,10,8),M(0xd9a37a));btb.position.y=.8;bth.position.y=1.8;bt.add(btb,bth);bt.position.set(0,0,-11.5);IN.add(bt);
[[-6,0],[6,2],[-5,6],[-12,8],[10,9],[-13,-3]].forEach(t=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1,12),M(0x6a4a2a));m.position.set(t[0],.5,t[1]);IN.add(m);COL.push({x:t[0],z:1000+t[1],r:1.3})});
const ex=new THREE.Mesh(new THREE.BoxGeometry(3,4,.4),dark);ex.position.set(0,2,14.6);IN.add(ex);
const l1=new THREE.PointLight(0xffaa55,1.3,50);l1.position.set(0,5,0);IN.add(l1);const l2=new THREE.PointLight(0x66aaff,.6,20);l2.position.set(6,4,5);IN.add(l2);
label('Bartender',0,3.8,988.5);label('Exit',0,5,1014.3);
function near(){const pn=prog.near();if(pn)return pn;if(ins){if(Math.hypot(P.x,P.z-990)<6)return'talk to the bartender';if(Math.hypot(P.x-12,P.z-997)<5)return'browse the shop';if(P.z>1012)return'leave';return''}if(bs==0&&Math.hypot(P.x-RX,P.z-RZ)<6)return'begin the Jedi Trial';return Math.hypot(P.x+13.9,P.z-12.5)<4.5?'enter the Cantina':''}
function enter(){ins=1;P.x=0;P.z=1010;P.f=3.14;S.background.setHex(0x1a1208);S.fog.color.setHex(0x1a1208);hemi.intensity=.45;sun.intensity=0;say('Welcome to the Mos Eisley Cantina.')}
function leave(){ins=0;P.x=-11.7;P.z=10.5;S.background.setHex(0xf3c98b);S.fog.color.setHex(0xf3c98b);hemi.intensity=.75;sun.intensity=.9}
function talk(){const q=QS[qi];if(!q){say('Bartender: You have cleared the desert, hero.',5);return}
 if(!qa){qa=1;qc=0;say('Bartender: '+q.t+'. Pay is '+q.r+' credits.',5)}else if(qc>=q.n){qi++;qa=0;prog.reward(q)}else say('Bartender: Still at it? '+q.t,4)}
function use(){if(shop){closeShop();return}if(prog.use())return;if(ins){if(Math.hypot(P.x,P.z-990)<6){talk();return}if(Math.hypot(P.x-12,P.z-997)<5){shop=1;sel=0;shopR();return}if(P.z>1012)leave();return}if(Math.hypot(P.x-RX,P.z-RZ)<6){trial();return}if(Math.hypot(P.x+13.9,P.z-12.5)<4.5)enter()}
