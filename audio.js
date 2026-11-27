// AUDIO: synthesized sound effects, desert wind, cantina music, mute key, and the hooks that trigger them. Load AFTER the gameplay files.
// ---------- SOUND (synthesized with WebAudio, no audio files) ----------
let AC=null,mg=null,windG=null,NB=null,mute=0,musT=0,musI=0,lastHp=100,lastStep=0,lastIns=0,lastBz=0;
function aud(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.gain.value=mute?0:.5;mg.connect(AC.destination);
  NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const w=AC.createBufferSource();w.buffer=NB;w.loop=true;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=500;windG=AC.createGain();windG.gain.value=.06;w.connect(f);f.connect(windG);windG.connect(mg);w.start();
  const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=.15;lg.gain.value=.03;lf.connect(lg);lg.connect(windG.gain);lf.start()}catch(e){AC=null;return null}}
 if(AC.state=='suspended')AC.resume();return AC}
addEventListener('keydown',()=>aud());addEventListener('pointerdown',()=>aud());
function tn(type,f1,f2,dur,vol,t0){const t=AC.currentTime+(t0||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f2),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(mg);o.start(t);o.stop(t+dur+.02)}
function nz(dur,fr,q,vol,t0){const t=AC.currentTime+(t0||0),s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type='bandpass';f.frequency.value=fr;f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(mg);s.start(t,Math.random()*1.5,dur+.02)}
function sfx(k){if(!AC||mute)return;
 if(k=='swing'){tn('sawtooth',520,140,.22,.2);nz(.18,1800,1,.15)}
 else if(k=='hit'){nz(.1,700,1,.35);tn('square',160,60,.1,.15)}
 else if(k=='push'){tn('sine',140,35,.5,.5);nz(.4,300,.7,.3)}
 else if(k=='throw'){nz(.5,1200,2,.2);tn('triangle',300,500,.5,.08)}
 else if(k=='zap'){for(let i=0;i<7;i++)tn('sawtooth',200+Math.random()*700,100+Math.random()*500,.05,.12,i*.035)}
 else if(k=='bz'){if(AC.currentTime-lastBz<.15)return;lastBz=AC.currentTime;tn('sawtooth',320,110,.14,.1)}
 else if(k=='dash'){nz(.25,2500,.8,.25)}
 else if(k=='buy'){tn('square',880,880,.07,.12);tn('square',1320,1320,.12,.12,.07)}
 else if(k=='level'||k=='win'){[523,659,784,1047,1319].slice(0,k=='win'?5:4).forEach((f,i)=>tn('triangle',f,f,.25,.2,i*.09))}
 else if(k=='hurt'){tn('sine',110,50,.25,.5);nz(.12,200,.8,.25)}
 else if(k=='door'){tn('triangle',220,330,.2,.2)}
 else if(k=='boss'){tn('sawtooth',90,45,1,.3)}
 else if(k=='step'){nz(.05,300+Math.random()*120,1,.07)}}
const wr=(n,f)=>{const o=window[n];window[n]=function(){return f(o,arguments)}};
wr('swing',(o,a)=>{const b=St.sw;o();if(St.sw>b)sfx('swing')});
wr('push',(o,a)=>{const b=St.fc;o();if(St.fc>b)sfx('push')});
wr('thr',(o,a)=>{const b=St.tc;o();if(St.tc>b)sfx('throw')});
wr('lgt',(o,a)=>{const b=St.lc;o();if(St.lc>b)sfx('zap')});
wr('dash',(o,a)=>{const b=St.dash;o();if(St.dash>b)sfx('dash')});
wr('buy',(o,a)=>{const b=cr;o();if(cr<b)sfx('buy')});
wr('hit',(o,a)=>{const l=St.lv;o(a[0],a[1],a[2],a[3]);sfx('hit');if(St.lv>l)sfx('level')});
wr('die',(o,a)=>{o();sfx('hurt')});
wr('bossWin',(o,a)=>{o(a[0]);sfx('win')});
wr('trial',(o,a)=>{const b=bs;o();if(bs>b)sfx('boss')});
wr('enter',(o,a)=>{o();sfx('door')});wr('leave',(o,a)=>{o();sfx('door')});
wr('ebolt',(o,a)=>{o(a[0],a[1],a[2],a[3],a[4],a[5]);sfx('bz')});
// per-frame hook: minimap, footsteps, hurt sound, ambience, cantina music
wr('thUpd',(o,a)=>{o(a[0]);mm();prog.tick(a[0]);
 if(!AC&&[...(navigator.getGamepads?navigator.getGamepads():[])].some(g=>g&&g.buttons.some(b=>b.pressed)))aud();
 if(!AC)return;
 if(St.hp<lastHp-.5)sfx('hurt');lastHp=St.hp;
 const sp=Math.floor(walkPh/Math.PI);if(sp!==lastStep){lastStep=sp;if(!prog.sn)sfx('step')}
 if(ins!==lastIns){lastIns=ins;windG.gain.setTargetAtTime(ins?.004:.06,AC.currentTime,.4)}
 if(ins&&!mute&&AC.currentTime>musT){const sc=[0,3,5,7,10,12,10,7,5,3],f=196*Math.pow(2,sc[musI%10]/12);tn('triangle',f,f,.2,.09);if(musI%4==0)tn('square',f/2,f/2,.25,.05);musI++;musT=AC.currentTime+.22}});
