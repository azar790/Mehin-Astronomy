import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createEquirectangularEarthCanvas, createDetailedMoonTexture } from '../utils/earthTextures';

/**
 * Robust Apple Astronomy-Grade 3D Scene
 * Built on high-performance Standard Materials (zero WebGL shader crash on iOS Safari).
 * Features real physical directional day/night lighting, city beacon, orbiting Moon, and smooth touch drag.
 */
export function AppleEarthScene({
  lat = 40.4093,
  lng = 49.8671,
  isDay = true,
  dayProgress = 50,
  cityName = 'Baku',
  explorerName = 'Mehin',
  avatarEmoji = '🧑‍🚀',
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId = null;
    let renderer = null;

    try {
      const width = container.clientWidth || 360;
      const height = 340;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 0, 4.2);

      // 2. High-Performance Mobile WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Clear previous canvas if any
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // 3. Earth Group & Sphere
      const earthGroup = new THREE.Group();
      scene.add(earthGroup);

      const earthRadius = 1.38;
      const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
      const dayTexture = createEquirectangularEarthCanvas();

      // MeshStandardMaterial reacts physically to Directional Sunlight (100% stable on iOS Safari)
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: dayTexture,
        roughness: 0.65,
        metalness: 0.1,
      });

      const earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
      earthGroup.add(earthMesh);

      // 4. Soft Atmospheric Halo
      const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.025, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: isDay ? 0x38bdf8 : 0x818cf8,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      earthGroup.add(atmosMesh);

      // 5. Sun (Directional Light + Visual Corona in Space)
      const sunAngle = isDay ? (dayProgress / 100 - 0.5) * Math.PI * 0.75 : Math.PI;
      const sunDist = 10;
      const sunLight = new THREE.DirectionalLight(0xfffbeb, isDay ? 3.4 : 2.0);
      sunLight.position.set(
        Math.sin(sunAngle) * sunDist,
        0.5,
        Math.cos(sunAngle) * sunDist
      );
      scene.add(sunLight);

      // Soft Night Ambient Light (so Earth's night side is a deep celestial midnight blue, not black void)
      const ambientLight = new THREE.AmbientLight(0x0f172a, 0.4);
      scene.add(ambientLight);

      // Visual Sun Disc in background
      const sunGroup = new THREE.Group();
      const sunCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      sunGroup.add(sunCore);

      const sunGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.35,
          side: THREE.BackSide,
        })
      );
      sunGroup.add(sunGlow);

      sunGroup.position.set(
        isDay ? (dayProgress > 50 ? 2.4 : -2.4) : -3.4,
        1.2,
        isDay ? -1.8 : -4.0
      );
      scene.add(sunGroup);

      // 6. Orbiting 3D Moon
      const moonGeo = new THREE.SphereGeometry(0.26, 24, 24);
      const moonTexture = createDetailedMoonTexture();
      const moonMat = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.9,
      });
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);

      const moonOrbitAngle = isDay ? -Math.PI * 0.6 : Math.PI * 0.25;
      moonMesh.position.set(
        Math.cos(moonOrbitAngle) * 2.5,
        -0.1,
        Math.sin(moonOrbitAngle) * 2.5
      );
      scene.add(moonMesh);

      // 7. Mehin's City Beacon
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const pinR = earthRadius + 0.02;
      const pinX = -(pinR * Math.sin(phi) * Math.cos(theta));
      const pinZ = pinR * Math.sin(phi) * Math.sin(theta);
      const pinY = pinR * Math.cos(phi);

      const beaconGroup = new THREE.Group();

      const pinCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      pinCore.position.set(pinX, pinY, pinZ);
      beaconGroup.add(pinCore);

      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.12, 24),
        new THREE.MeshBasicMaterial({
          color: 0xec4899,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        })
      );
      ringMesh.position.set(pinX, pinY, pinZ);
      ringMesh.lookAt(pinX * 2, pinY * 2, pinZ * 2);
      beaconGroup.add(ringMesh);

      earthMesh.add(beaconGroup);

      // Target initial rotation towards selected city
      const initialRotY = - (lng * (Math.PI / 180)) - Math.PI / 2;
      earthMesh.rotation.y = initialRotY;
      earthMesh.rotation.x = (lat * (Math.PI / 180)) * 0.25;

      // 8. Interactive Touch & Drag
      let isDragging = false;
      let prevX = 0;
      let prevY = 0;

      const onStart = (e) => {
        isDragging = true;
        const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        prevX = cx;
        prevY = cy;
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        const dx = cx - prevX;
        const dy = cy - prevY;

        earthMesh.rotation.y += dx * 0.008;
        earthMesh.rotation.x = Math.max(-0.5, Math.min(0.5, earthMesh.rotation.x + dy * 0.005));

        prevX = cx;
        prevY = cy;
      };

      const onEnd = () => {
        isDragging = false;
      };

      const dom = renderer.domElement;
      dom.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      dom.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);

      // 9. Kinetic Render Loop (Safe 60 FPS)
      let clock = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        clock += 0.03;

        if (!isDragging) {
          earthMesh.rotation.y += 0.0008;
        }

        // Pulse Beacon
        const scale = 1 + Math.sin(clock * 2) * 0.3;
        ringMesh.scale.set(scale, scale, scale);

        // Moon subtle suspension
        moonMesh.position.y = -0.1 + Math.sin(clock * 0.4) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      const onResize = () => {
        if (!container) return;
        const nw = container.clientWidth;
        camera.aspect = nw / height;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, height);
      };
      window.addEventListener('resize', onResize);

      // Clean cleanup function
      return () => {
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        dom.removeEventListener('mousedown', onStart);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        dom.removeEventListener('touchstart', onStart);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
        renderer.dispose();
        earthGeo.dispose();
        earthMaterial.dispose();
        atmosGeo.dispose();
        atmosMat.dispose();
        moonGeo.dispose();
        moonMat.dispose();
        dayTexture.dispose();
      };
    } catch (err) {
      console.error('ThreeJS Earth error:', err);
    }
  }, [lat, lng, isDay, dayProgress]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[340px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Subtle Space Indicator: Sun in distance */}
      <div className="absolute top-2 left-4 pointer-events-none flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
        <span>Sunlight</span>
      </div>

      {/* Subtle Space Indicator: Moon in distance */}
      <div className="absolute top-2 right-4 pointer-events-none flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-300/80">
        <span>Moon</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shadow-[0_0_8px_#ffffff]" />
      </div>

      {/* Floating Spatial Pin: "Mehin is here" */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white tracking-wide shadow-2xl">
        <span>{avatarEmoji}</span>
        <span className="text-white font-bold">{explorerName}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300">{cityName}</span>
      </div>
    </div>
  );
}
