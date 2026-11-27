// MINIMAP: the rotating round map in the top-right corner.
// ---------- MINIMAP ----------
const MC=document.getElementById('mm'),MX=MC.getContext('2d');
function mm(){const c=75,s=.45;MX.clearRect(0,0,150,150);MX.save();MX.beginPath();MX.arc(c,c,c-2,0,6.283);MX.clip();MX.fillStyle='rgba(20,14,8,.72)';MX.fillRect(0,0,150,150);
 if(ins){MX.fillStyle='#fff';MX.font='bold 13px sans-serif';MX.textAlign='center';MX.fillText('Cantina',c,c+4)}
 else{const sy=Math.sin(cy),cc=Math.cos(cy),pt=(x,z)=>{const dx=x-P.x,dz=z-P.z;return[c+(dx*cc-dz*sy)*s,c+(dx*sy+dz*cc)*s]};
  let q=pt(0,0);MX.fillStyle='rgba(217,185,138,.55)';MX.beginPath();MX.arc(q[0],q[1],30*s,0,6.283);MX.fill();
  q=pt(48,-28);MX.fillStyle='#8a9098';MX.fillRect(q[0]-4,q[1]-4,8,8);
  q=pt(-20,18);MX.fillStyle='#ffd24a';MX.beginPath();MX.arc(q[0],q[1],4,0,6.283);MX.fill();
  q=pt(RX,RZ);MX.fillStyle='#66ccff';MX.beginPath();MX.moveTo(q[0],q[1]-5);MX.lineTo(q[0]+4,q[1]);MX.lineTo(q[0],q[1]+5);MX.lineTo(q[0]-4,q[1]);MX.fill();
  for(const e of EN){if(e.dead)continue;q=pt(e.x,e.z);MX.fillStyle=e.boss?'#c66cff':'#e04040';MX.beginPath();MX.arc(q[0],q[1],e.boss?4.5:2.5,0,6.283);MX.fill()}
  const a=P.f-cy;MX.fillStyle='#fff';MX.beginPath();MX.moveTo(c+Math.sin(a)*8,c+Math.cos(a)*8);MX.lineTo(c+Math.sin(a+2.5)*6,c+Math.cos(a+2.5)*6);MX.lineTo(c+Math.sin(a-2.5)*6,c+Math.cos(a-2.5)*6);MX.fill()}
 MX.restore();MX.strokeStyle='rgba(255,255,255,.55)';MX.lineWidth=2;MX.beginPath();MX.arc(c,c,c-2,0,6.283);MX.stroke()}
