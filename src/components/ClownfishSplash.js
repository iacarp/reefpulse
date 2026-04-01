import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Animated } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export default function ClownfishSplash({ onFinish }) {
  const canvasRef = useRef(null);
  const uiOpacity = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let T = 0;
    let animId;
    const bubbles = [];
    const sparks = [];

    const fish = {
      x: -80, y: H * 0.62,
      speed: 1.4, dir: 1,
      scaleX: 1,
      vy: 0, targetY: H * 0.62,
      scared: 0, greet: 120,
    };

    function rand(a, b) { return a + Math.random() * (b - a); }

    function spawnBubble(x, y, big) {
      const n = big ? 8 : 1;
      for (let i = 0; i < n; i++)
        bubbles.push({ x: x+rand(-6,6), y, vx: rand(-0.35,0.35), vy: rand(-1.3,-0.55), r: big?rand(4,10):rand(2,4), life: 1, big });
    }
    function spawnSparks(x, y) {
      for (let i = 0; i < 14; i++) {
        const a = rand(0, Math.PI*2), sp = rand(1.5, 4.5);
        sparks.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, r: rand(2,5), life: 1, hue: rand(170,215) });
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      const r = canvas.getBoundingClientRect();
      const px = (e.clientX-r.left)*(W/r.width), py = (e.clientY-r.top)*(H/r.height);
      if (Math.sqrt((px-fish.x)**2+(py-fish.y)**2) < 80) {
        spawnBubble(fish.x+(fish.dir>0?-48:48), fish.y-4, true);
        spawnSparks(fish.x, fish.y);
        fish.scared = 60;
      }
    });

    setTimeout(() => {
      Animated.timing(uiOpacity, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    }, 600);
    Animated.loop(Animated.sequence([
      Animated.timing(ring1Scale, { toValue: 1.06, duration: 1300, useNativeDriver: true }),
      Animated.timing(ring1Scale, { toValue: 1.0, duration: 1300, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(ring2Scale, { toValue: 1.06, duration: 1300, delay: 400, useNativeDriver: true }),
      Animated.timing(ring2Scale, { toValue: 1.0, duration: 1300, useNativeDriver: true }),
    ])).start();

    function bodyTopY(dx) {
      const t=(dx+54)/102; if(t<0||t>1) return 0;
      const u=1-t; return u*u*u*0+3*u*u*t*(-32)+3*u*t*t*(-36)+t*t*t*(-20);
    }
    function bodyBotY(dx) {
      const t=(dx+54)/102; if(t<0||t>1) return 0;
      const u=1-t; return u*u*u*0+3*u*u*t*30+3*u*t*t*34+t*t*t*18;
    }
    function drawBodyPath() {
      ctx.beginPath(); ctx.moveTo(-54,0);
      ctx.bezierCurveTo(-32,30,8,34,46,18);
      ctx.bezierCurveTo(62,8,66,-8,48,-20);
      ctx.bezierCurveTo(18,-36,-18,-32,-54,0);
      ctx.closePath();
    }
    function pecPath(pax,pay,pf) {
      ctx.beginPath(); ctx.moveTo(pax,pay);
      ctx.bezierCurveTo(pax+8+pf*0.3,pay+8,pax+16+pf,pay+20+pf*0.4,pax+8+pf,pay+28+pf*0.3);
      ctx.bezierCurveTo(pax-2,pay+20,pax-8,pay+10,pax,pay);
    }

    function drawBg() { ctx.fillStyle='#020c1a'; ctx.fillRect(0,0,W,H); }
    function drawRays() {
      for (let i=0; i<6; i++) {
        const cx=50+i*60+Math.sin(T*0.18+i*1.1)*18;
        ctx.save(); ctx.globalAlpha=0.025+Math.sin(T*0.25+i)*0.012;
        const grd=ctx.createLinearGradient(cx,0,cx,H*0.8);
        grd.addColorStop(0,'#38bdf8'); grd.addColorStop(1,'transparent');
        ctx.fillStyle=grd; ctx.beginPath(); ctx.moveTo(cx-12,0); ctx.lineTo(cx+12,0);
        ctx.lineTo(cx+55,H*0.8); ctx.lineTo(cx-55,H*0.8); ctx.fill(); ctx.restore();
      }
    }
    function drawWater() {
      for (let i=0; i<4; i++) {
        ctx.save(); ctx.globalAlpha=0.055-i*0.01;
        ctx.strokeStyle='#38bdf8'; ctx.lineWidth=H*0.055;
        ctx.beginPath(); ctx.moveTo(0,H*0.28+i*85);
        for (let x=0; x<=W; x+=18) ctx.lineTo(x,H*0.28+i*85+Math.sin(T*0.35+x*0.025+i)*5);
        ctx.stroke(); ctx.restore();
      }
    }
    function drawFloor() {
      const grd=ctx.createLinearGradient(0,H-130,0,H);
      grd.addColorStop(0,'#071828'); grd.addColorStop(1,'#0a1e30');
      ctx.fillStyle=grd; ctx.beginPath(); ctx.moveTo(0,H);
      for (let x=0; x<=W; x+=15) ctx.lineTo(x,H-52-Math.sin(x*0.033)*20-Math.cos(x*0.017)*12);
      ctx.lineTo(W,H); ctx.fill();
      ctx.fillStyle='#0c2235'; ctx.beginPath(); ctx.moveTo(0,H);
      for (let x=0; x<=W; x+=15) ctx.lineTo(x,H-24-Math.sin(x*0.05+1)*8);
      ctx.lineTo(W,H); ctx.fill();
    }
    function drawAnemone(acx,acy,scl,hue) {
      for (let i=0; i<10; i++) {
        const a=(i/10)*Math.PI*2, sway=Math.sin(T*0.5+i*0.8)*0.22, len=50*scl;
        const ex=acx+Math.cos(a+sway)*len, ey=acy+Math.sin(a+sway)*len;
        const cpx=acx+Math.cos(a+sway*0.5)*len*0.5, cpy=acy+Math.sin(a+sway*0.5)*len*0.5;
        ctx.strokeStyle=`hsla(${hue},62%,48%,0.88)`; ctx.lineWidth=5.5*scl; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(acx,acy); ctx.quadraticCurveTo(cpx,cpy,ex,ey); ctx.stroke();
        ctx.fillStyle=`hsla(${hue+22},72%,68%,0.95)`;
        ctx.beginPath(); ctx.arc(ex,ey,5.5*scl,0,Math.PI*2); ctx.fill();
      }
      ctx.fillStyle=`hsla(${hue},50%,32%,1)`;
      ctx.beginPath(); ctx.arc(acx,acy,11*scl,0,Math.PI*2); ctx.fill();
    }
    function drawBranchCoral(x,y,len,angle,depth,hue) {
      if (depth===0||len<5) return;
      const sway=Math.sin(T*0.45+depth*0.8+x*0.01)*0.1;
      const ex=x+Math.cos(angle+sway)*len, ey=y+Math.sin(angle+sway)*len;
      ctx.strokeStyle=`hsla(${hue},58%,${32+depth*8}%,0.92)`; ctx.lineWidth=depth*2.5; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(ex,ey); ctx.stroke();
      if (depth===1) { ctx.fillStyle=`hsla(${hue+12},72%,62%,0.92)`; ctx.beginPath(); ctx.arc(ex,ey,5.5,0,Math.PI*2); ctx.fill(); }
      drawBranchCoral(ex,ey,len*0.68,angle-0.5,depth-1,hue);
      drawBranchCoral(ex,ey,len*0.68,angle+0.5,depth-1,hue);
      if (depth>2) drawBranchCoral(ex,ey,len*0.5,angle,depth-1,hue);
    }
    function drawFanCoral(fcx,fcy,hue,scl) {
      for (let i=0; i<16; i++) {
        const a=-Math.PI*0.85+(i/15)*Math.PI*0.7, sway=Math.sin(T*0.42+i*0.55)*0.07;
        const len=(42+Math.sin(i*0.85)*14)*scl;
        ctx.strokeStyle=`hsla(${hue},60%,${42+i*2}%,0.72)`; ctx.lineWidth=1.8; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(fcx,fcy);
        ctx.quadraticCurveTo(fcx+Math.cos(a+sway)*len*0.45+Math.sin(a)*9*scl,fcy+Math.sin(a+sway)*len*0.45,fcx+Math.cos(a+sway)*len,fcy+Math.sin(a+sway)*len);
        ctx.stroke();
      }
      ctx.fillStyle=`hsla(${hue},45%,28%,1)`; ctx.beginPath(); ctx.arc(fcx,fcy,7*scl,0,Math.PI*2); ctx.fill();
    }
    function drawSeaweed(scx,scy,scl) {
      for (let s=0; s<3; s++) {
        const ox=scx+(s-1)*10*scl;
        ctx.strokeStyle=`hsla(140,55%,${28+s*5}%,0.82)`; ctx.lineWidth=4.5*scl; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(ox,scy);
        for (let i=1; i<=6; i++) ctx.lineTo(ox+Math.sin(T*0.55+i*1.0+ox*0.01)*15*scl,scy-i*38*scl);
        ctx.stroke();
      }
    }
    function drawReef() {
      drawSeaweed(28,H-50,0.88); drawSeaweed(W-32,H-46,0.82); drawSeaweed(W*0.44,H-44,0.72);
      drawBranchCoral(62,H-60,40,-Math.PI/2,5,340); drawBranchCoral(W-85,H-55,36,-Math.PI/2,5,15);
      drawBranchCoral(W*0.35,H-48,30,-Math.PI/2,4,350);
      drawFanCoral(W*0.59,H-57,280,1.05); drawFanCoral(W*0.22,H-53,312,0.88);
      drawAnemone(W*0.51,H-60,1.08,268); drawAnemone(W*0.28,H-53,0.9,295); drawAnemone(W*0.81,H-57,0.94,253);
    }

    function drawClownfish(fcx,fcy,scaleX,pec1,pec2) {
      ctx.save();
      ctx.translate(fcx,fcy);
      ctx.scale(scaleX,1);
      ctx.rotate(fish.vy*0.04);

      const tw=Math.sin(T*2.8)*14+(fish.scared>0?Math.sin(T*5)*8:0);
      const ds=Math.sin(T*1.8)*2;
      const vf=Math.sin(T*1.4)*3;
      const pax=28, lBot=bodyBotY(pax), lTop=bodyTopY(pax);
      const pay=lBot-(lBot-lTop)*0.25;

      // tail
      const tGrd=ctx.createRadialGradient(0,0,2,0,0,26);
      tGrd.addColorStop(0,'#b83808'); tGrd.addColorStop(1,'#e06020');
      ctx.save(); ctx.translate(-54,0);
      ctx.fillStyle=tGrd;
      ctx.beginPath(); ctx.moveTo(0,0);
      ctx.bezierCurveTo(-8,-6+tw*0.4,-22,-20+tw,-32,-13+tw);
      ctx.bezierCurveTo(-26,-5+tw*0.1,-10,-1,0,0);
      ctx.bezierCurveTo(-8,6-tw*0.4,-22,20-tw,-32,13-tw);
      ctx.bezierCurveTo(-26,5-tw*0.1,-10,1,0,0);
      ctx.fill(); ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.restore();

      // ventral
      const vGrd=ctx.createLinearGradient(10,22,20,44);
      vGrd.addColorStop(0,'#c04010'); vGrd.addColorStop(1,'#803010');
      ctx.fillStyle=vGrd;
      ctx.beginPath(); ctx.moveTo(10,22); ctx.bezierCurveTo(14,28+vf,20,38+vf,14,44+vf);
      ctx.bezierCurveTo(6,36+vf,2,28,10,22);
      ctx.fill(); ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();

      // pectoral back
      ctx.fillStyle='rgba(130,35,5,0.45)';
      pecPath(pax,pay,pec2); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(pax-30,pay+13,60,40); ctx.clip();
      pecPath(pax,pay,pec2); ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=2; ctx.stroke(); ctx.restore();

      // body
      ctx.fillStyle='#c03808'; drawBodyPath(); ctx.fill();
      const hlX=-5-scaleX*10;
      const bGrd=ctx.createRadialGradient(hlX,-14,4,hlX,-14,72);
      bGrd.addColorStop(0,'#ff8c38'); bGrd.addColorStop(0.35,'#e85515');
      bGrd.addColorStop(0.7,'#c03808'); bGrd.addColorStop(1,'#7a2004');
      ctx.fillStyle=bGrd; drawBodyPath(); ctx.fill();
      ctx.save(); drawBodyPath(); ctx.clip();
      const hlGrd=ctx.createRadialGradient(hlX,-22,1,hlX,-18,30);
      hlGrd.addColorStop(0,`rgba(255,220,160,${0.4*Math.abs(scaleX)+0.1})`);
      hlGrd.addColorStop(1,'rgba(255,100,30,0)');
      ctx.fillStyle=hlGrd; ctx.beginPath(); ctx.ellipse(hlX,-18,28,14,0.08,0,Math.PI*2); ctx.fill();
      const sGrd=ctx.createRadialGradient(0,26,2,0,22,38);
      sGrd.addColorStop(0,'rgba(50,10,0,0.55)'); sGrd.addColorStop(1,'rgba(50,10,0,0)');
      ctx.fillStyle=sGrd; ctx.fillRect(-60,-10,120,50);
      ctx.restore();
      ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=1.5; drawBodyPath(); ctx.stroke();

      // dorsal
      const d0x=-24,d0y=bodyTopY(-24),d1x=-10,d1y=bodyTopY(-10);
      const d2x=4,d2y=bodyTopY(4),d3x=18,d3y=bodyTopY(18),d4x=28,d4y=bodyTopY(28);
      const dGrd=ctx.createLinearGradient(0,d1y-14,0,d1y);
      dGrd.addColorStop(0,'#e05018'); dGrd.addColorStop(1,'#8a2808');
      ctx.fillStyle=dGrd;
      ctx.beginPath(); ctx.moveTo(d0x,d0y);
      ctx.bezierCurveTo(d0x+2,d0y-7+ds,d1x-4,d1y-8+ds,d1x,d1y-6+ds);
      ctx.bezierCurveTo(d1x+3,d1y-4+ds,d2x-3,d2y-5+ds,d2x,d2y-5+ds);
      ctx.bezierCurveTo(d2x+4,d2y-14+ds,d3x-2,d3y-14+ds,d3x,d3y-10+ds);
      ctx.bezierCurveTo(d3x+4,d3y-4+ds,d4x-2,d4y,d4x,d4y);
      ctx.bezierCurveTo(d3x+2,d3y,d1x+2,d1y,d0x,d0y);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.55)'; ctx.lineWidth=1.3;
      [[d0x+4,d0y-4],[d1x-2,d1y-6],[d1x+6,d1y-5],[d2x+4,d2y-10],[d3x,d3y-12]].forEach(([sx,sy])=>{
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx,sy-5+ds); ctx.stroke();
      });
      ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1.1;
      ctx.beginPath(); ctx.moveTo(d0x,d0y);
      ctx.bezierCurveTo(d0x+2,d0y-7+ds,d1x-4,d1y-8+ds,d1x,d1y-6+ds);
      ctx.bezierCurveTo(d1x+3,d1y-4+ds,d2x-3,d2y-5+ds,d2x,d2y-5+ds);
      ctx.bezierCurveTo(d2x+4,d2y-14+ds,d3x-2,d3y-14+ds,d3x,d3y-10+ds);
      ctx.bezierCurveTo(d3x+4,d3y-4+ds,d4x-2,d4y,d4x,d4y); ctx.stroke();

      // anal
      ctx.fillStyle='#8a2808';
      ctx.beginPath(); ctx.moveTo(-15,28); ctx.bezierCurveTo(-11,37,-4,39,2,28);
      ctx.bezierCurveTo(-3,31,-10,31,-15,28); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=1; ctx.stroke();

      // stripes
      ctx.save(); drawBodyPath(); ctx.clip();
      [{x:28,w:5.5,curve:3},{x:2,w:6.5,curve:5},{x:-22,w:5,curve:2}].forEach(({x,w,curve})=>{
        ctx.fillStyle='rgba(0,0,0,0.82)';
        ctx.beginPath(); ctx.moveTo(x-w-2,-44); ctx.bezierCurveTo(x-w-2+curve,0,x-w-2+curve*0.5,0,x-w-2,40);
        ctx.lineTo(x+w+2,40); ctx.bezierCurveTo(x+w+2-curve*0.5,0,x+w+2-curve,0,x+w+2,-44); ctx.closePath(); ctx.fill();
        const sg=ctx.createLinearGradient(x-w,-30,x+w,30);
        sg.addColorStop(0,'rgba(255,255,255,0.95)'); sg.addColorStop(0.5,'rgba(255,255,255,1)'); sg.addColorStop(1,'rgba(200,200,200,0.85)');
        ctx.fillStyle=sg;
        ctx.beginPath(); ctx.moveTo(x-w,-42); ctx.bezierCurveTo(x-w+curve,0,x-w+curve*0.5,0,x-w,38);
        ctx.lineTo(x+w,38); ctx.bezierCurveTo(x+w-curve*0.5,0,x+w-curve,0,x+w,-42); ctx.closePath(); ctx.fill();
      });
      ctx.restore();
      ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=1.5; drawBodyPath(); ctx.stroke();

      // pectoral front
      const pfGrd=ctx.createLinearGradient(pax,pay,pax+20,pay+30);
      pfGrd.addColorStop(0,'rgba(240,100,20,0.9)'); pfGrd.addColorStop(1,'rgba(150,40,5,0.75)');
      ctx.fillStyle=pfGrd; pecPath(pax,pay,pec1); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(pax-30,pay+13,60,40); ctx.clip();
      pecPath(pax,pay,pec1); ctx.strokeStyle='rgba(0,0,0,0.65)'; ctx.lineWidth=2.5; ctx.stroke(); ctx.restore();
      ctx.fillStyle='rgba(0,0,0,0.85)'; ctx.beginPath(); ctx.arc(pax,pay,5,-Math.PI*0.5,Math.PI*0.5); ctx.fill();

      // eye
      const eX=46, eY=-8;
      const eyeGrd=ctx.createRadialGradient(eX-2,eY-3,1,eX,eY,9);
      eyeGrd.addColorStop(0,'#fff'); eyeGrd.addColorStop(1,'#d8d8e8');
      ctx.fillStyle=eyeGrd; ctx.beginPath(); ctx.arc(eX,eY,9,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#0a0820'; ctx.beginPath(); ctx.arc(eX+1,eY,7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1a2ab0'; ctx.beginPath(); ctx.arc(eX+1,eY,4.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#060410'; ctx.beginPath(); ctx.arc(eX+1.5,eY,2.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(eX-0.5,eY-2,1.8,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(eX,eY,9,0,Math.PI*2); ctx.stroke();

      // smile
      ctx.strokeStyle='rgba(0,0,0,0.7)'; ctx.lineWidth=1.8; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(56,4); ctx.quadraticCurveTo(62,12,68,4); ctx.stroke();
      ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(60,-1); ctx.lineTo(66,-1); ctx.stroke();

      ctx.restore();
    }

    function update() {
      T += 0.016;
      if (fish.greet > 0) fish.greet--;
      if (fish.scared > 0) fish.scared--;

      fish.x += fish.speed * fish.dir;
      fish.targetY = H*0.58 + Math.sin(T*0.4)*H*0.12;
      fish.vy += (fish.targetY - fish.y) * 0.008;
      fish.vy *= 0.92;
      fish.y += fish.vy;
      fish.y = Math.max(H*0.35, Math.min(H*0.82, fish.y));
      fish.scaleX += (fish.dir - fish.scaleX) * 0.06;

      if (fish.dir === 1 && fish.x > W+80) {
        fish.x = -80; fish.y = rand(H*0.4, H*0.75); fish.vy = 0; fish.speed = rand(1.1, 1.8);
        if (Math.random() < 0.4) { fish.dir = -1; fish.scaleX = -1; }
      }
      if (fish.dir === -1 && fish.x < -80) {
        fish.x = W+80; fish.y = rand(H*0.4, H*0.75); fish.vy = 0; fish.speed = rand(1.1, 1.8);
        if (Math.random() < 0.4) { fish.dir = 1; fish.scaleX = 1; }
      }

      if (Math.random() < 0.022)
        bubbles.push({ x: rand(10,W-10), y: H-55, vx: rand(-0.2,0.2), vy: rand(-0.45,-0.22), r: rand(2.5,6), life: 1, big: false, ambient: true });
      if (Math.random() < 0.003)
        spawnBubble(fish.x+(fish.dir>0?-48:48), fish.y-4, false);

      for (let i=bubbles.length-1; i>=0; i--) {
        const b=bubbles[i]; b.x+=b.vx+Math.sin(T*2+i*0.7)*0.25; b.y+=b.vy;
        b.life -= b.ambient?0.004:b.big?0.01:0.009; if (b.life<=0) bubbles.splice(i,1);
      }
      for (let i=sparks.length-1; i>=0; i--) {
        const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.vx*=0.92; s.vy*=0.92; s.life-=0.025;
        if (s.life<=0) sparks.splice(i,1);
      }
    }

    function drawBubbles() {
      bubbles.forEach(b => {
        ctx.save(); ctx.globalAlpha=b.ambient?b.life*0.35:b.life*(b.big?0.88:0.52);
        ctx.strokeStyle=b.big?'rgba(140,230,255,0.95)':'rgba(6,182,212,0.7)'; ctx.lineWidth=b.big?1.5:1;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.stroke();
        if (b.big) {
          ctx.fillStyle='rgba(180,245,255,0.15)'; ctx.fill();
          ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(b.x-b.r*0.32,b.y-b.r*0.32,b.r*0.28,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      });
    }
    function drawSparks() {
      sparks.forEach(s => {
        ctx.save(); ctx.globalAlpha=s.life; ctx.fillStyle=`hsla(${s.hue},85%,70%,1)`;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r*s.life,0,Math.PI*2); ctx.fill(); ctx.restore();
      });
    }

    function frame() {
      update();
      drawBg(); drawRays(); drawWater(); drawFloor(); drawReef();
      drawClownfish(fish.x, fish.y, fish.scaleX, Math.sin(T*3.0)*13, Math.sin(T*3.0+Math.PI)*10);
      drawBubbles(); drawSparks();
      animId = requestAnimationFrame(frame);
    }
    frame();

    // auto-finish after 3.5s
    const timer = setTimeout(() => { if (onFinish) onFinish(); }, 3500);

    return () => { cancelAnimationFrame(animId); clearTimeout(timer); };
  }, []);

  // Native: simple animated splash (canvas not available)
  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        {/* Animated background bubbles */}
        <Animated.View style={{ position: 'absolute', inset: 0, backgroundColor: '#020c1a' }} />
        <Animated.View style={[styles.overlay, { opacity: uiOpacity }]}>
          <View style={styles.logoWrap}>
            <Animated.View style={[styles.ring2, { transform: [{ scale: ring1Scale }] }]} />
            <Animated.View style={[styles.ring3, { transform: [{ scale: ring2Scale }] }]} />
            <Text style={styles.logoIcon}>🪸</Text>
          </View>
          <Text style={styles.brand}>ReefPulse</Text>
          <Text style={styles.sub}>REEF INTELLIGENCE</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Track · Diagnose · Thrive</Text>
          <Text style={{ fontSize: 48, marginTop: 40 }}>🐠</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <canvas ref={canvasRef} width={W} height={H} style={{ position: 'absolute', top: 0, left: 0, width: W, height: H }} />
      <Animated.View style={[styles.overlay, { opacity: uiOpacity }]}>
        <View style={styles.logoWrap}>
          <Animated.View style={[styles.ring2, { transform: [{ scale: ring1Scale }] }]} />
          <Animated.View style={[styles.ring3, { transform: [{ scale: ring2Scale }] }]} />
          <Text style={styles.logoIcon}>🪸</Text>
        </View>
        <Text style={styles.brand}>ReefPulse</Text>
        <Text style={styles.sub}>REEF INTELLIGENCE</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Track · Diagnose · Thrive</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, backgroundColor: '#020c1a' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
  logoWrap: { width: 76, height: 76, borderRadius: 22, borderWidth: 1.5, borderColor: 'rgba(6,182,212,0.45)', backgroundColor: 'rgba(6,182,212,0.09)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  ring2: { position: 'absolute', width: 94, height: 94, borderRadius: 31, borderWidth: 1, borderColor: 'rgba(6,182,212,0.18)' },
  ring3: { position: 'absolute', width: 112, height: 112, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(6,182,212,0.08)' },
  logoIcon: { fontSize: 34 },
  brand: { fontSize: 38, fontWeight: '800', color: '#06b6d4', letterSpacing: 3, textShadowColor: 'rgba(6,182,212,0.45)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  sub: { fontSize: 10, fontWeight: '700', color: 'rgba(148,163,184,0.65)', letterSpacing: 6, marginTop: 6 },
  divider: { width: 44, height: 1.5, backgroundColor: 'rgba(6,182,212,0.4)', borderRadius: 1, marginVertical: 13 },
  tagline: { fontSize: 13, color: 'rgba(203,213,225,0.6)', letterSpacing: 1.5 },
  hintWrap: { position: 'absolute', bottom: 36, left: 0, right: 0, alignItems: 'center', pointerEvents: 'none' },
  hint: { fontSize: 11, color: 'rgba(100,150,170,0.45)', letterSpacing: 1.5 },
  tapZone: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});
