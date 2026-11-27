// WORLD: scene, camera, renderer, lights, terrain, Mos Eisley town, spaceport, desert props, droids, suns.
function tex(r,g,b,v,rep){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='rgb('+r+','+g+','+b+')';x.fillRect(0,0,128,128);
 for(let i=0;i<1800;i++){const k=(Math.random()-.5)*v,w=k>0?255:0;x.fillStyle='rgba('+w+','+w+','+w+','+Math.abs(k)/255+')';x.fillRect(Math.random()*128,Math.random()*128,2,2)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);return t}
const S=new THREE.Scene();S.background=new THREE.Color(0xf3c98b);S.fog=new THREE.Fog(0xf3c98b,60,320);
const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,600);
const ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(innerWidth,innerHeight);ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.shadowMap.enabled=true;
ren.domElement.style.cssText='position:fixed;inset:0;z-index:0;touch-action:none';document.body.appendChild(ren.domElement);
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});
const hemi=new THREE.HemisphereLight(0xffe0b0,0x8a6a3a,.75);S.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0cc,.9);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-50,right:50,top:50,bottom:-50,near:1,far:300});S.add(sun,sun.target);
let sd=5;const R=()=>(sd=sd*16807%2147483647)/2147483647;
const H=(x,z)=>{const f=Math.min(1,Math.max(0,(Math.hypot(x,z)-70)/60));return f*(Math.sin(x*.02)*Math.cos(z*.025)*6+Math.sin(x*.06+z*.04)*1.5+Math.sin(z*.013)*5)};
// terrain
const G=new THREE.PlaneGeometry(700,700,160,160);G.rotateX(-Math.PI/2);
const p=G.attributes.position,col=[];
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,H(x,z));const n=.9+.1*Math.sin(x*.3)*Math.cos(z*.3);col.push(.85*n,.68*n,.42*n)}
G.setAttribute('color',new THREE.Float32BufferAttribute(col,3));G.computeVertexNormals();
const T=new THREE.Mesh(G,new THREE.MeshLambertMaterial({vertexColors:true,map:tex(255,255,255,90,70)}));T.receiveShadow=true;S.add(T);
// helpers
const COL=[],M=c=>new THREE.MeshLambertMaterial({color:c}),sand=new THREE.MeshLambertMaterial({color:0xd9b98a,map:tex(255,255,255,70,3)}),dark=M(0x2a1a10);
function label(t,x,y,z){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,0,256,64);g.fillStyle='#fff';g.font='bold 28px sans-serif';g.textAlign='center';g.fillText(t,128,42);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),fog:false}));s.scale.set(10,2.5,1);s.position.set(x,y,z);S.add(s)}
function bld(x,z,r,h,dome){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.05,h,16),sand);b.position.y=h/2;b.castShadow=b.receiveShadow=true;g.add(b);
 if(dome){const d=new THREE.Mesh(new THREE.SphereGeometry(r,16,8,0,6.283,0,1.5708),sand);d.position.y=h;d.castShadow=true;g.add(d)}
 const o=new THREE.Mesh(new THREE.BoxGeometry(r*.4,h*.7,.3),dark);o.position.set(0,h*.35,r*1.02);g.add(o);
 g.position.set(x,0,z);g.rotation.y=Math.atan2(-x,-z);S.add(g);COL.push({x,z,r:r+.8})}
// town
for(let i=0;i<18;i++){const a=i/18*6.283+.25*Math.sin(i*7),rad=26+(i*37%5)*6;bld(Math.cos(a)*rad,Math.sin(a)*rad,3.5+(i*13%4),4+(i*7%3),i%3!=0)}
bld(-20,18,8,6,true);label('Cantina',-20,17.5,18);
// spaceport
const pad=new THREE.Mesh(new THREE.CylinderGeometry(13,13,.4,32),M(0x555a60));pad.position.set(48,.2,-28);pad.receiveShadow=true;S.add(pad);
const ship=new THREE.Group();[[8,2,5,0],[3,1,12,0]].forEach(a=>{const b=new THREE.Mesh(new THREE.BoxGeometry(a[0],a[1],a[2]),M(0xb8bcc2));b.position.y=2.2;b.castShadow=true;ship.add(b)});
const cp=new THREE.Mesh(new THREE.SphereGeometry(1.4,12,8),M(0x7ab8e0));cp.position.set(0,3,-2);ship.add(cp);
[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,1,12),new THREE.MeshBasicMaterial({color:0x66ccff}));e.rotation.x=1.57;e.position.set(s*2.5,2.2,6.2);ship.add(e)});
ship.position.set(48,0,-28);S.add(ship);COL.push({x:48,z:-28,r:7});label('Spaceport',48,9,-28);
// vaporators, rocks, mesas
for(let i=0;i<12;i++){const a=i*.55,rad=85+(i%4)*9,x=Math.cos(a)*rad,z=Math.sin(a)*rad,g=new THREE.Group(),m=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,6,8),M(0xaab0b6));m.position.y=3;m.castShadow=true;g.add(m);
 for(let k=0;k<3;k++){const f=new THREE.Mesh(new THREE.BoxGeometry(.2,2.4,1.4),M(0xcfd3d8));f.position.set(Math.cos(k*2.1)*.9,4,Math.sin(k*2.1)*.9);f.rotation.y=-k*2.1;g.add(f)}
 g.position.set(x,H(x,z),z);S.add(g);COL.push({x,z,r:1.2})}
for(let i=0;i<70;i++){const a=R()*6.283,rad=75+R()*220,x=Math.cos(a)*rad,z=Math.sin(a)*rad,s=.8+R()*2.5,r=new THREE.Mesh(new THREE.DodecahedronGeometry(s),M(0x8a6a48));r.position.set(x,H(x,z)+s*.4,z);r.rotation.set(R()*3,R()*3,0);r.castShadow=true;S.add(r);if(s>1.8)COL.push({x,z,r:s})}
for(let i=0;i<14;i++){const a=R()*6.283,rad=190+R()*90,w=20+R()*30,h=25+R()*35,x=Math.cos(a)*rad,z=Math.sin(a)*rad,m=new THREE.Mesh(new THREE.BoxGeometry(w,h,w*.8),M(0xa5663a));m.position.set(x,H(x,z)+h/2-3,z);m.rotation.y=R()*3;S.add(m)}
// droids
const droids=[];for(let i=0;i<5;i++){const d=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.35,.4,.8,10),M(0xddddd8)),h=new THREE.Mesh(new THREE.SphereGeometry(.35,10,8,0,6.283,0,1.57),M(0x3a6fc4));b.position.y=.5;h.position.y=.9;d.add(b,h);S.add(d);droids.push({d,cx:(R()-.5)*24,cz:(R()-.5)*24,s:.3+R()*.4,ph:R()*6})}
// twin suns
const suns=[[.55,.45,-.7,10,0xfff2b0],[.4,.38,-.8,7,0xffb060]].map(a=>{const m=new THREE.Mesh(new THREE.SphereGeometry(a[3],16,12),new THREE.MeshBasicMaterial({color:a[4],fog:false}));S.add(m);return{m,v:new THREE.Vector3(a[0],a[1],a[2]).normalize().multiplyScalar(420)}});
