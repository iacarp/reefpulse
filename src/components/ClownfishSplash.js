import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export default function ClownfishSplash({ onFinish }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let T = 0;
    let animId;
    const bubbles = [];
    const sparks = [];
    const fish = { x: W / 2, y: H * 0.72, vx: 0.5, vy: 0, tx: W / 2, ty: H * 0.72, dir: 1, scared: 0 };

    function rand(a, b) { return a + Math.random() * (b - a); }

    function spawnBubble(x, y, big) {
      const n = big ? 8 : 1;
      for (let i = 0; i < n; i++)
        bubbles.push({ x: x + rand(-6, 6), y, vx: rand(-0.35, 0.35), vy: rand(-1.3, -0.55), r: big ? rand(4, 10) : rand(2, 4), life: 1, big });
    }

    function spawnSparks(x, y) {
      for (let i = 0; i < 14; i++) {
        const a = rand(0, Math.PI * 2), sp = rand(1.5, 4.5);
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rand(2, 5), life: 1, hue: rand(170, 215) });
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      const r = canvas.getBoundingClientRect();
      const px = (e.clientX - r.left) * (W / r.width);
      const py = (e.clientY - r.top) * (H / r.height);
      const dx = px - fish.x, dy = py - fish.y;
      if (Math.sqrt(dx * dx + dy * dy) < 70) {
        const stripeX = fish.x + (fish.dir > 0 ? 28 : -28);
        spawnBubble(stripeX, fish.y - 4, true);
        spawnSparks(fish.x, fish.y);
        fish.scared = 80;
        fish.vx = fish.dir * (2.5 + Math.random() * 2);
        fish.vy = rand(-1.5, 1.5);
      }
    });

    // ── body helpers ──
    function bodyTopY(fcx, fcy, dx) {
      const t = (dx - (fcx - 54)) / ((fcx + 48) - (fcx - 54));
      if (t < 0 || t > 1) return fcy;
      const p0 = fcy, p1 = fcy - 32, p2 = fcy - 36, p3 = fcy - 20, u = 1 - t;
      return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
    }
    function bodyBotY(fcx, fcy, dx) {
      const t = (dx - (fcx - 54)) / ((fcx + 48) - (fcx - 54));
      if (t < 0 || t > 1) return fcy;
      const p0 = fcy, p1 = fcy + 30, p2 = fcy + 34, p3 = fcy + 18, u = 1 - t;
      return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
    }
    function drawBodyPath(fcx, fcy) {
      ctx.beginPath();
      ctx.moveTo(fcx - 54, fcy);
      ctx.bezierCurveTo(fcx - 32, fcy + 30, fcx + 8, fcy + 34, fcx + 46, fcy + 18);
      ctx.bezierCurveTo(fcx + 62, fcy + 8, fcx + 66, fcy - 8, fcx + 48, fcy - 20);
      ctx.bezierCurveTo(fcx + 18, fcy - 36, fcx - 18, fcy - 32, fcx - 54, fcy);
      ctx.closePath();
    }
    function pecPath(pax, pay, pf) {
      ctx.beginPath();
      ctx.moveTo(pax, pay);
      ctx.bezierCurveTo(pax + 8 + pf * 0.3, pay + 8, pax + 16 + pf, pay + 20 + pf * 0.4, pax + 8 + pf, pay + 28 + pf * 0.3);
      ctx.bezierCurveTo(pax - 2, pay + 20, pax - 8, pay + 10, pax, pay);
    }

    // ── background / reef helpers ──
    function drawBg() {
      ctx.fillStyle = '#020c1a'; ctx.fillRect(0, 0, W, H);
    }
    function drawRays() {
      for (let i = 0; i < 6; i++) {
        const cx = 50 + i * 60 + Math.sin(T * 0.18 + i * 1.1) * 18;
        ctx.save(); ctx.globalAlpha = 0.025 + Math.sin(T * 0.25 + i) * 0.012;
        const grd = ctx.createLinearGradient(cx, 0, cx, H * 0.8);
        grd.addColorStop(0, '#38bdf8'); grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.moveTo(cx - 12, 0); ctx.lineTo(cx + 12, 0);
        ctx.lineTo(cx + 55, H * 0.8); ctx.lineTo(cx - 55, H * 0.8); ctx.fill(); ctx.restore();
      }
    }
    function drawWaterLines() {
      for (let i = 0; i < 4; i++) {
        ctx.save(); ctx.globalAlpha = 0.055 - i * 0.01;
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = H * 0.055;
        ctx.beginPath(); ctx.moveTo(0, H * 0.28 + i * 85);
        for (let x = 0; x <= W; x += 18) ctx.lineTo(x, H * 0.28 + i * 85 + Math.sin(T * 0.35 + x * 0.025 + i) * 5);
        ctx.stroke(); ctx.restore();
      }
    }
    function drawFloor() {
      const grd = ctx.createLinearGradient(0, H - 130, 0, H);
      grd.addColorStop(0, '#071828'); grd.addColorStop(1, '#0a1e30');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 15) ctx.lineTo(x, H - 52 - Math.sin(x * 0.033) * 20 - Math.cos(x * 0.017) * 12);
      ctx.lineTo(W, H); ctx.fill();
      ctx.fillStyle = '#0c2235'; ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 15) ctx.lineTo(x, H - 24 - Math.sin(x * 0.05 + 1) * 8);
      ctx.lineTo(W, H); ctx.fill();
    }
    function drawAnemone(acx, acy, scl, hue) {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2, sway = Math.sin(T * 0.5 + i * 0.8) * 0.22, len = 50 * scl;
        const ex = acx + Math.cos(a + sway) * len, ey = acy + Math.sin(a + sway) * len;
        const cpx = acx + Math.cos(a + sway * 0.5) * len * 0.5, cpy = acy + Math.sin(a + sway * 0.5) * len * 0.5;
        ctx.strokeStyle = `hsla(${hue},62%,48%,0.88)`; ctx.lineWidth = 5.5 * scl; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(acx, acy); ctx.quadraticCurveTo(cpx, cpy, ex, ey); ctx.stroke();
        ctx.fillStyle = `hsla(${hue + 22},72%,68%,0.95)`;
        ctx.beginPath(); ctx.arc(ex, ey, 5.5 * scl, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `hsla(${hue},50%,32%,1)`;
      ctx.beginPath(); ctx.arc(acx, acy, 11 * scl, 0, Math.PI * 2); ctx.fill();
    }
    function drawBranchCoral(x, y, len, angle, depth, hue) {
      if (depth === 0 || len < 5) return;
      const sway = Math.sin(T * 0.45 + depth * 0.8 + x * 0.01) * 0.1;
      const ex = x + Math.cos(angle + sway) * len, ey = y + Math.sin(angle + sway) * len;
      ctx.strokeStyle = `hsla(${hue},58%,${32 + depth * 8}%,0.92)`;
      ctx.lineWidth = depth * 2.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
      if (depth === 1) {
        ctx.fillStyle = `hsla(${hue + 12},72%,62%,0.92)`;
        ctx.beginPath(); ctx.arc(ex, ey, 5.5, 0, Math.PI * 2); ctx.fill();
      }
      drawBranchCoral(ex, ey, len * 0.68, angle - 0.5, depth - 1, hue);
      drawBranchCoral(ex, ey, len * 0.68, angle + 0.5, depth - 1, hue);
      if (depth > 2) drawBranchCoral(ex, ey, len * 0.5, angle, depth - 1, hue);
    }
    function drawFanCoral(fcx, fcy, hue, scl) {
      for (let i = 0; i < 16; i++) {
        const a = -Math.PI * 0.85 + (i / 15) * Math.PI * 0.7, sway = Math.sin(T * 0.42 + i * 0.55) * 0.07;
        const len = (42 + Math.sin(i * 0.85) * 14) * scl;
        ctx.strokeStyle = `hsla(${hue},60%,${42 + i * 2}%,0.72)`; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(fcx, fcy);
        ctx.quadraticCurveTo(fcx + Math.cos(a + sway) * len * 0.45 + Math.sin(a) * 9 * scl, fcy + Math.sin(a + sway) * len * 0.45, fcx + Math.cos(a + sway) * len, fcy + Math.sin(a + sway) * len);
        ctx.stroke();
      }
      ctx.fillStyle = `hsla(${hue},45%,28%,1)`; ctx.beginPath(); ctx.arc(fcx, fcy, 7 * scl, 0, Math.PI * 2); ctx.fill();
    }
    function drawSeaweed(scx, scy, scl) {
      for (let s = 0; s < 3; s++) {
        const ox = scx + (s - 1) * 10 * scl;
        ctx.strokeStyle = `hsla(140,55%,${28 + s * 5}%,0.82)`; ctx.lineWidth = 4.5 * scl; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(ox, scy);
        for (let i = 1; i <= 6; i++) ctx.lineTo(ox + Math.sin(T * 0.55 + i * 1.0 + ox * 0.01) * 15 * scl, scy - i * 38 * scl);
        ctx.stroke();
      }
    }
    function drawReef() {
      drawSeaweed(28, H - 50, 0.88); drawSeaweed(W - 32, H - 46, 0.82); drawSeaweed(W * 0.44, H - 44, 0.72);
      drawBranchCoral(62, H - 60, 40, -Math.PI / 2, 5, 340); drawBranchCoral(W - 85, H - 55, 36, -Math.PI / 2, 5, 15);
      drawBranchCoral(W * 0.35, H - 48, 30, -Math.PI / 2, 4, 350);
      drawFanCoral(W * 0.59, H - 57, 280, 1.05); drawFanCoral(W * 0.22, H - 53, 312, 0.88);
      drawAnemone(W * 0.51, H - 60, 1.08, 268); drawAnemone(W * 0.28, H - 53, 0.9, 295); drawAnemone(W * 0.81, H - 57, 0.94, 253);
    }

    // ── clownfish ──
    function drawClownfish(fcx, fcy, dir, scared) {
      ctx.save();
      ctx.translate(fcx, fcy);
      if (dir < 0) ctx.scale(-1, 1);
      const wobble = scared > 0 ? Math.sin(T * 7) * 4 : Math.sin(T * 1.8) * 2;
      ctx.rotate(wobble * 0.022);

      const tw = Math.sin(T * 2.8) * 11 + (scared > 0 ? Math.sin(T * 5) * 8 : 0);
      const ds = Math.sin(T * 1.8) * 2;
      const pf1 = Math.sin(T * 2.5) * 9;
      const pf2 = Math.sin(T * 2.5 + Math.PI) * 7;
      const vf = Math.sin(T * 2.0) * 4;

      const stripeX = 28;
      const localTopY = bodyTopY(0, 0, stripeX);
      const localBotY = bodyBotY(0, 0, stripeX);
      const pax = stripeX;
      const pay = localBotY - (localBotY - localTopY) * 0.25;

      // tail
      ctx.save(); ctx.translate(-54, 0);
      ctx.fillStyle = '#d04810';
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-8, -6 + tw * 0.4, -22, -20 + tw, -32, -13 + tw);
      ctx.bezierCurveTo(-26, -5 + tw * 0.1, -10, -1, 0, 0);
      ctx.bezierCurveTo(-8, 6 - tw * 0.4, -22, 20 - tw, -32, 13 - tw);
      ctx.bezierCurveTo(-26, 5 - tw * 0.1, -10, 1, 0, 0);
      ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();

      // ventral
      ctx.fillStyle = '#c04010';
      ctx.beginPath(); ctx.moveTo(10, 22);
      ctx.bezierCurveTo(14, 28 + vf, 20, 38 + vf, 14, 44 + vf);
      ctx.bezierCurveTo(6, 36 + vf, 2, 28, 10, 22);
      ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke();

      // pectoral back
      ctx.fillStyle = 'rgba(160,45,5,0.52)';
      pecPath(pax, pay, pf2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.rect(pax - 30, pay + 13, 60, 40); ctx.clip();
      pecPath(pax, pay, pf2);
      ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      // body
      ctx.fillStyle = '#e85515';
      drawBodyPath(0, 0); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 2; ctx.stroke();

      // dorsal
      const d0x = -24, d0y = bodyTopY(0, 0, -24);
      const d1x = -10, d1y = bodyTopY(0, 0, -10);
      const d2x = 4,   d2y = bodyTopY(0, 0, 4);
      const d3x = 18,  d3y = bodyTopY(0, 0, 18);
      const d4x = 28,  d4y = bodyTopY(0, 0, 28);
      ctx.fillStyle = '#c04010';
      ctx.beginPath();
      ctx.moveTo(d0x, d0y);
      ctx.bezierCurveTo(d0x+2,d0y-7+ds,d1x-4,d1y-8+ds,d1x,d1y-6+ds);
      ctx.bezierCurveTo(d1x+3,d1y-4+ds,d2x-3,d2y-5+ds,d2x,d2y-5+ds);
      ctx.bezierCurveTo(d2x+4,d2y-14+ds,d3x-2,d3y-14+ds,d3x,d3y-10+ds);
      ctx.bezierCurveTo(d3x+4,d3y-4+ds,d4x-2,d4y,d4x,d4y);
      ctx.bezierCurveTo(d3x+2,d3y,d1x+2,d1y,d0x,d0y);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1.3;
      [[d0x+4,d0y-4],[d1x-2,d1y-6],[d1x+6,d1y-5],[d2x+4,d2y-10],[d3x,d3y-12]].forEach(([sx,sy])=>{
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx,sy-5+ds); ctx.stroke();
      });

      // anal
      ctx.fillStyle = '#c04010';
      ctx.beginPath(); ctx.moveTo(-15, 28);
      ctx.bezierCurveTo(-11, 37, -4, 39, 2, 28);
      ctx.bezierCurveTo(-3, 31, -10, 31, -15, 28);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke();

      // white stripes clipped to body
      ctx.save();
      drawBodyPath(0, 0); ctx.clip();
      [{x:28,w:5.5,curve:3},{x:2,w:6.5,curve:5},{x:-22,w:5,curve:2}].forEach(({x,w,curve})=>{
        ctx.fillStyle = 'rgba(0,0,0,0.82)';
        ctx.beginPath();
        ctx.moveTo(x-w-2,-44); ctx.bezierCurveTo(x-w-2+curve,0,x-w-2+curve*0.5,0,x-w-2,40);
        ctx.lineTo(x+w+2,40); ctx.bezierCurveTo(x+w+2-curve*0.5,0,x+w+2-curve,0,x+w+2,-44);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(x-w,-42); ctx.bezierCurveTo(x-w+curve,0,x-w+curve*0.5,0,x-w,38);
        ctx.lineTo(x+w,38); ctx.bezierCurveTo(x+w-curve*0.5,0,x+w-curve,0,x+w,-42);
        ctx.closePath(); ctx.fill();
      });
      ctx.restore();
      ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 2;
      drawBodyPath(0, 0); ctx.stroke();

      // pectoral front
      ctx.fillStyle = 'rgba(210,70,10,0.82)';
      pecPath(pax, pay, pf1); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.rect(pax - 30, pay + 13, 60, 40); ctx.clip();
      pecPath(pax, pay, pf1);
      ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();

      // attachment dot
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.beginPath(); ctx.arc(pax, pay, 5, -Math.PI * 0.5, Math.PI * 0.5); ctx.fill();

      // eye
      ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(46, -8, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0a0820'; ctx.beginPath(); ctx.arc(47, -8, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(45, -10, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(46, -8, 9, 0, Math.PI * 2); ctx.stroke();

      // mouth
      ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(63, 4); ctx.quadraticCurveTo(68, 8, 66, 4); ctx.stroke();

      ctx.restore();
    }

    function drawBubbles() {
      bubbles.forEach(b => {
        ctx.save();
        ctx.globalAlpha = b.ambient ? b.life * 0.35 : b.life * (b.big ? 0.88 : 0.52);
        ctx.strokeStyle = b.big ? 'rgba(140,230,255,0.95)' : 'rgba(6,182,212,0.7)';
        ctx.lineWidth = b.big ? 1.5 : 1;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
        if (b.big) {
          ctx.fillStyle = 'rgba(180,245,255,0.15)'; ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.beginPath(); ctx.arc(b.x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.28, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      });
    }

    function drawSparks() {
      sparks.forEach(s => {
        ctx.save(); ctx.globalAlpha = s.life;
        ctx.fillStyle = `hsla(${s.hue},85%,70%,1)`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    function update() {
      T += 0.016;
      if (fish.scared > 0) {
        fish.scared--;
        if (fish.scared === 0) { fish.vx = fish.dir * 0.5; fish.vy = 0; }
      } else {
        if (Math.random() < 0.007) { fish.tx = rand(80, W - 80); fish.ty = rand(H * 0.5, H * 0.82); }
        fish.vx += (fish.tx - fish.x) * 0.004;
        fish.vy += (fish.ty - fish.y) * 0.004;
        fish.vy += Math.sin(T * 1.25) * 0.05;
      }
      fish.vx *= 0.95; fish.vy *= 0.95;
      fish.x = Math.max(75, Math.min(W - 75, fish.x + fish.vx));
      fish.y = Math.max(H * 0.48, Math.min(H * 0.85, fish.y + fish.vy));
      if (fish.vx > 0.2) fish.dir = 1; else if (fish.vx < -0.2) fish.dir = -1;
      if (Math.random() < 0.003) spawnBubble(fish.x + (fish.dir > 0 ? -50 : 50), fish.y - 4, false);
      if (Math.random() < 0.022) bubbles.push({ x: rand(10, W - 10), y: H - 55, vx: rand(-0.2, 0.2), vy: rand(-0.55, -0.28), r: rand(2.5, 6), life: 1, big: false, ambient: true });
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.x += b.vx + Math.sin(T * 2 + i * 0.7) * 0.3; b.y += b.vy;
        b.life -= b.ambient ? 0.004 : b.big ? 0.01 : 0.009;
        if (b.life <= 0) bubbles.splice(i, 1);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vx *= 0.9; s.vy *= 0.9; s.life -= 0.03;
        if (s.life <= 0) sparks.splice(i, 1);
      }
    }

    function frame() {
      update();
      drawBg(); drawRays(); drawWaterLines(); drawFloor(); drawReef();
      drawClownfish(fish.x, fish.y, fish.dir, fish.scared);
      drawBubbles(); drawSparks();
      animId = requestAnimationFrame(frame);
    }
    frame();

    // auto-finish after 4s if onFinish provided
    const timer = onFinish ? setTimeout(onFinish, 4000) : null;
    return () => {
      cancelAnimationFrame(animId);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (Platform.OS !== 'web') return null;

  return (
    <View style={styles.container}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ width: W, height: H }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999,
  },
});
