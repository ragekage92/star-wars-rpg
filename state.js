// SHARED STATE: variables every other file reads and writes. Loads first.
let shop=0,sel=0,ins=0,cr=0,qi=0,qa=0,qc=0,bs=0,rob=0,TH=null;const FXL=[];
const P={x:0,z:16,y:0,vy:0,f:0};   // player position/facing
const St={hp:100,xp:0,lv:1,k:0,cd:0,fc:0,sw:0,tt:0,inv:0,dash:0,sta:100,tc:0,lc:0,cmb:0,ct:0,swd:.35,swk:0,spr:0},mhp=()=>100+10*(St.lv-1)+20*rob+bn('hp'),EN=[],HD=document.getElementById('s'),MS=document.getElementById('m');
let rings=[],pb=[];
