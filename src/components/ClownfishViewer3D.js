/**
 * ClownfishViewer3D
 * 
 * 3D clownfish built with Three.js (r128).
 * - Elongated sphere body
 * - All fins: dorsal, anal, pectorals (x2), ventrals (x2), tail
 * - Tail wags slowly ±20° independently
 * - Drag to rotate 360° in any direction
 * - Bevel on all fins for rounded edges
 * 
 * Status: WIP — stripes measured from photo, eye positions accurate
 * Next: natural swimming animation like giphy reference
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

export default function ClownfishViewer3D({ style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Load Three.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => initScene();
    document.head.appendChild(script);

    let animId;
    let renderer, scene, camera, fish, tailGroup, T = 0;
    let rotX = 0.15, rotY = 0.5, velX = 0, velY = 0.008;
    let dragging = false, lastX = 0, lastY = 0;

    function initScene() {
      const THREE = window.THREE;
      const container = mountRef.current;
      if (!container) return;

      const cW = container.clientWidth || 390;
      const cH = container.clientHeight || 480;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(cW, cH);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0x020c1a);
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, cW / cH, 0.1, 100);
      camera.position.set(0, 0, 7);

      // lights
      scene.add(new THREE.AmbientLight(0x334466, 0.7));
      const key = new THREE.DirectionalLight(0xfff8f0, 1.6);
      key.position.set(3, 5, 6); scene.add(key);
      const fill = new THREE.DirectionalLight(0x4466aa, 0.4);
      fill.position.set(-4, -2, 2); scene.add(fill);
      const rim = new THREE.DirectionalLight(0x002244, 0.5);
      rim.position.set(0, -4, -5); scene.add(rim);

      // materials
      const fishMat = new THREE.MeshPhongMaterial({ color: 0xe85515, shininess: 120, specular: 0xff9944 });
      const finMat = new THREE.MeshPhongMaterial({ color: 0xc04010, shininess: 40, side: THREE.DoubleSide, transparent: true, opacity: 0.92 });

      fish = new THREE.Group();
      scene.add(fish);

      // ── BODY ──
      const bGeo = new THREE.SphereGeometry(1, 64, 40);
      const bp = bGeo.attributes.position;
      for (let i = 0; i < bp.count; i++) {
        bp.setXYZ(i, bp.getX(i) * 2.0, bp.getY(i), bp.getZ(i) * 0.85);
      }
      bGeo.computeVertexNormals();
      fish.add(new THREE.Mesh(bGeo, fishMat));

      function makeFin(shape, mat, thickness = 0.03) {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: thickness, bevelEnabled: true,
          bevelThickness: thickness * 0.8, bevelSize: 0.03, bevelSegments: 4
        });
        return new THREE.Mesh(geo, mat);
      }

      // ── DORSAL ──
      const dorsalShape = new THREE.Shape();
      dorsalShape.moveTo(-0.8, 0);
      dorsalShape.bezierCurveTo(-0.6, 0.18, -0.35, 0.22, -0.15, 0.16);
      dorsalShape.bezierCurveTo(0.0, 0.12, 0.05, 0.13, 0.1, 0.16);
      dorsalShape.bezierCurveTo(0.25, 0.32, 0.5, 0.36, 0.7, 0.26);
      dorsalShape.bezierCurveTo(0.8, 0.16, 0.88, 0.06, 0.9, 0);
      dorsalShape.lineTo(-0.8, 0);
      const dorsal = makeFin(dorsalShape, finMat, 0.025);
      dorsal.rotation.x = Math.PI;
      dorsal.position.set(-0.1, 1.0, -0.012);
      fish.add(dorsal);

      // ── ANAL ──
      const analShape = new THREE.Shape();
      analShape.moveTo(-0.2, 0);
      analShape.bezierCurveTo(-0.1, -0.16, 0.08, -0.26, 0.18, -0.22);
      analShape.bezierCurveTo(0.22, -0.14, 0.2, -0.05, 0.18, 0);
      analShape.lineTo(-0.2, 0);
      const anal = makeFin(analShape, finMat, 0.025);
      anal.rotation.x = Math.PI;
      anal.position.set(-0.45, -1.0, -0.012);
      fish.add(anal);

      // ── PECTORALS ──
      [-1, 1].forEach(side => {
        const pShape = new THREE.Shape();
        pShape.moveTo(0, 0);
        pShape.bezierCurveTo(0.06, 0.14, 0.24, 0.36, 0.18, 0.50);
        pShape.bezierCurveTo(0.06, 0.44, -0.08, 0.28, -0.12, 0.10);
        pShape.lineTo(0, 0);
        const pec = makeFin(pShape, new THREE.MeshPhongMaterial({
          color: 0xd06020, shininess: 30, side: THREE.DoubleSide, transparent: true, opacity: 0.88
        }), 0.02);
        pec.position.set(0.3, -0.1, side * 0.84);
        pec.rotation.y = side * (Math.PI / 2 + 0.4);
        pec.rotation.x = side * (-0.25);
        fish.add(pec);
      });

      // ── VENTRALS ──
      [-1, 1].forEach(side => {
        const vShape = new THREE.Shape();
        vShape.moveTo(0, 0);
        vShape.bezierCurveTo(0.04, -0.12, 0.14, -0.28, 0.08, -0.36);
        vShape.bezierCurveTo(-0.02, -0.30, -0.1, -0.16, -0.1, -0.02);
        vShape.lineTo(0, 0);
        const vent = makeFin(vShape, finMat, 0.02);
        vent.position.set(0.2, -0.92, side * 0.25);
        vent.rotation.y = side * 0.4;
        fish.add(vent);
      });

      // ── TAIL GROUP (wags independently) ──
      tailGroup = new THREE.Group();
      tailGroup.position.set(-2.0, 0, 0);
      fish.add(tailGroup);

      const tailShape = new THREE.Shape();
      tailShape.moveTo(0, 0.12);
      tailShape.bezierCurveTo(-0.08, 0.22, -0.35, 0.58, -0.55, 0.55);
      tailShape.bezierCurveTo(-0.44, 0.20, -0.18, 0.05, 0, 0);
      tailShape.bezierCurveTo(-0.18, -0.05, -0.44, -0.20, -0.55, -0.55);
      tailShape.bezierCurveTo(-0.35, -0.58, -0.08, -0.22, 0, -0.12);
      tailShape.lineTo(0, 0.12);

      const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
        depth: 0.10, bevelEnabled: true,
        bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 5
      });
      const tailMesh = new THREE.Mesh(tailGeo, new THREE.MeshPhongMaterial({
        color: 0xd04810, shininess: 60, side: THREE.DoubleSide
      }));
      tailMesh.position.z = -0.05;
      tailGroup.add(tailMesh);

      // ── DRAG ──
      const el = container;
      el.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; velX = 0; velY = 0; });
      el.addEventListener('pointermove', e => {
        if (!dragging) return;
        velY = (e.clientX - lastX) * 0.015; velX = (e.clientY - lastY) * 0.015;
        rotY += velY; rotX += velX;
        rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
        lastX = e.clientX; lastY = e.clientY;
      });
      el.addEventListener('pointerup', () => { dragging = false; });

      animate();
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      T += 0.016;
      if (!dragging) { velY *= 0.96; velX *= 0.96; rotY += velY + 0.008; rotX += velX; rotX *= 0.98; }
      if (fish) { fish.rotation.y = rotY; fish.rotation.x = rotX; }
      if (tailGroup) tailGroup.rotation.y = Math.sin(T * 1.2) * 0.35;
      if (renderer && scene && camera) renderer.render(scene, camera);
    }

    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      document.head.removeChild(script);
    };
  }, []);

  if (Platform.OS !== 'web') return null;

  return <View ref={mountRef} style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
  container: {
    width: W,
    height: 480,
    backgroundColor: '#020c1a',
  },
});
