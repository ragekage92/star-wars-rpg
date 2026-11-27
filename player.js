// PLAYER: the character mesh, the GLB loader (./player.glb) and the robe-color fallback.
// player
const pl=new THREE.Group(),robe=new THREE.Mesh(new THREE.ConeGeometry(.7,1.6,12),M(0x5a4632)),head=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),M(0xd9a37a)),saber=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1.2,8),new THREE.MeshBasicMaterial({color:0x66ccff}));
robe.position.y=.8;head.position.y=1.8;saber.position.set(.55,1.2,.35);saber.rotation.x=.5;robe.castShadow=true;const hood=new THREE.Mesh(new THREE.SphereGeometry(.38,12,10,0,6.283,0,1.9),M(0x3a2c1e));hood.position.y=1.86;
const belt=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.14,12),M(0x2a1a10));belt.position.y=1.0;
const arm=x=>{const a=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.8,8),M(0x5a4632));a.position.set(x,1.3,.1);a.rotation.z=x>0?-.4:.4;return a};
const eyes=[-.1,.1].map(x=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.04,6,6),M(0x111111));e.position.set(x,1.83,.28);return e});
pl.add(robe,head,saber,hood,belt,arm(.6),arm(-.6),...eyes);S.add(pl);let plModel=null,walkPh=0;
function loadPlayer(){
 if(!THREE.GLTFLoader){say('GLTFLoader missing: check ./GLTFLoader.js',8);return}
 new THREE.GLTFLoader().load('./player.glb',g=>{
  const m=g.scene,b=new THREE.Box3().setFromObject(m),s=b.getSize(new THREE.Vector3()),k=2.1/(Math.max(s.x,s.y,s.z)||1);
  m.scale.setScalar(k);b.setFromObject(m);const c=b.getCenter(new THREE.Vector3());m.position.set(-c.x,-b.min.y,-c.z);
  m.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.frustumCulled=false;
   (Array.isArray(o.material)?o.material:[o.material]).forEach(mt=>{if(!mt)return;
    if(!mt.map){if(mt.vertexColors)mt.vertexColors=false;if(mt.color)mt.color.setHex(0x6e5442)}else{if(mt.color)mt.color.setRGB(1.8,1.6,1.4);if(mt.emissive){mt.emissive.setHex(0x6e5442);mt.emissiveIntensity=.55}}
    if('metalness' in mt){mt.metalness=0;mt.roughness=.85}
    mt.needsUpdate=true})});
  pl.children.forEach(x=>{if(x!==saber)x.visible=false});
  plPv=new THREE.Group();plPv.add(m,saber);pl.add(plPv);plModel=m;saber.geometry.translate(0,.6,0);rigInit(m);say('Player 3D loaded!',4)},
  undefined,e=>{say('GLB error: '+(e&&e.message?e.message:e),8)})}

