import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export default function OceanBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let T = 0;
    let animId;

    // bubbles
    const bubbles = [];
    for (let i = 0; i < 40; i++) {
      bubbles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 2 + Math.random() * 5,
        vy: 0.25 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.15,
        opacity: 0.1 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function draw() {
      T += 0.016;
      ctx.clearRect(0, 0, W, H);

      // dark ocean gradient background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#020c1a');
      bg.addColorStop(0.5, '#041428');
      bg.addColorStop(1, '#020c1a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // light rays from top
      for (let i = 0; i < 5; i++) {
        const cx = 60 + i * 70 + Math.sin(T * 0.15 + i * 1.2) * 20;
        ctx.save();
        ctx.globalAlpha = 0.018 + Math.sin(T * 0.22 + i) * 0.008;
        const ray = ctx.createLinearGradient(cx, 0, cx, H * 0.75);
        ray.addColorStop(0, '#38bdf8');
        ray.addColorStop(1, 'transparent');
        ctx.fillStyle = ray;
        ctx.beginPath();
        ctx.moveTo(cx - 10, 0); ctx.lineTo(cx + 10, 0);
        ctx.lineTo(cx + 50, H * 0.75); ctx.lineTo(cx - 50, H * 0.75);
        ctx.fill();
        ctx.restore();
      }

      // horizontal water shimmer lines
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.globalAlpha = 0.04 - i * 0.008;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = H * 0.04;
        ctx.beginPath();
        ctx.moveTo(0, H * 0.2 + i * 100);
        for (let x = 0; x <= W; x += 20)
          ctx.lineTo(x, H * 0.2 + i * 100 + Math.sin(T * 0.3 + x * 0.02 + i) * 4);
        ctx.stroke();
        ctx.restore();
      }

      // bubbles rising
      bubbles.forEach(b => {
        b.y -= b.vy;
        b.x += b.vx + Math.sin(T * 1.5 + b.phase) * 0.25;
        if (b.y < -10) {
          b.y = H + 10;
          b.x = Math.random() * W;
        }

        ctx.save();
        ctx.globalAlpha = b.opacity;
        ctx.strokeStyle = 'rgba(6,182,212,0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
        // inner highlight
        ctx.fillStyle = 'rgba(180,240,255,0.12)';
        ctx.fill();
        // shine dot
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  if (Platform.OS !== 'web') {
    // Native: static dark ocean background (canvas not available)
    return (
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: -1, pointerEvents: 'none',
        backgroundColor: '#020c1a',
      }} />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: W,
        height: H,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
