import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createProceduralEarthDayTexture, createProceduralMoonTexture } from '../utils/earthTextures';

/**
 * Interactive 3D Earth Globe with real-time Day/Night lighting and orbiting Moon/Sun
 */
export function EarthGlobe3D({ lat = 40.4093, lng = 49.8671, isDay = true, dayProgress = 50, cityName = 'Baku', explorerName = 'Mehin', avatarEmoji = '🧑‍🚀' }) {
  const containerRef = useRef(null);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 340;
    const height = 230;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear previous children if any
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // 3. Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(1.3, 64, 64);
    const dayTexture = createProceduralEarthDayTexture();
    
    // MeshStandardMaterial reacts to real lights (creates actual photorealistic 3D day/night terminator)
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      roughness: 0.7,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Atmosphere Glow Mesh
    const glowGeo = new THREE.SphereGeometry(1.34, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: isDay ? 0x38bdf8 : 0x818cf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // 4. City Pin (Pinpointing Mehin on Earth)
    // Convert lat/lng to 3D sphere coordinate
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const pinR = 1.32;
    const pinX = -(pinR * Math.sin(phi) * Math.cos(theta));
    const pinZ = pinR * Math.sin(phi) * Math.sin(theta);
    const pinY = pinR * Math.cos(phi);

    const pinGroup = new THREE.Group();
    // Glowing Pin Head
    const pinHeadGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const pinHeadMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
    pinHead.position.set(pinX, pinY, pinZ);
    pinGroup.add(pinHead);

    // Pulsing Pin Ring
    const ringGeo = new THREE.RingGeometry(0.08, 0.12, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(pinX, pinY, pinZ);
    ringMesh.lookAt(pinX * 2, pinY * 2, pinZ * 2);
    pinGroup.add(ringMesh);

    earthMesh.add(pinGroup);

    // Orient Earth so selected city is facing slightly towards the camera
    const targetYRotation = - (lng * (Math.PI / 180)) - Math.PI / 2;
    earthMesh.rotation.y = targetYRotation;
    earthMesh.rotation.x = 0.2; // Slight natural axial tilt

    // 5. Directional Light = SUN ☀️
    // Sun position depends on isDay and dayProgress
    // If it's day in this city, Sun is directly in front illuminating the city
    // If it's night, Sun shines on the back of Earth
    const sunLight = new THREE.DirectionalLight(0xfffbeb, isDay ? 3.2 : 2.5);
    const sunAngle = isDay ? 0 : Math.PI;
    const sunDist = 8;
    sunLight.position.set(
      Math.sin(sunAngle) * sunDist,
      0.5,
      Math.cos(sunAngle) * sunDist
    );
    scene.add(sunLight);

    // Ambient light: Soft dark space light on the night side (so earth is visible as deep night, not invisible pitch black)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 0.35);
    scene.add(ambientLight);

    // 6. Moon 🌙 (Orbiting body)
    const moonGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const moonTexture = createProceduralMoonTexture();
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.9,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    // Place moon in orbit
    const moonDistance = 2.4;
    const moonOrbitAngle = isDay ? Math.PI * 0.75 : -Math.PI * 0.25;
    moonMesh.position.set(
      Math.cos(moonOrbitAngle) * moonDistance,
      0.4,
      Math.sin(moonOrbitAngle) * moonDistance
    );
    scene.add(moonMesh);

    // 7. Interactive Drag to inspect globe
    let isDragging = false;
    let previousMouseX = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsRotating(true);
      previousMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - previousMouseX;
      earthMesh.rotation.y += deltaX * 0.008;
      previousMouseX = clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsRotating(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 8. Animation Loop
    let animationFrameId;
    let pulseTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Gentle continuous ambient drift when user is not touching
      if (!isDragging) {
        earthMesh.rotation.y += 0.0012;
      }

      // Pulse pin ring
      pulseTime += 0.04;
      const scale = 1 + Math.sin(pulseTime) * 0.3;
      ringMesh.scale.set(scale, scale, scale);
      ringMat.opacity = 0.5 + Math.cos(pulseTime) * 0.35;

      // Slow moon orbit
      moonMesh.rotation.y += 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      dayTexture.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      moonTexture.dispose();
    };
  }, [lat, lng, isDay, dayProgress]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-[230px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Clear Visual Indicators for a 7-Year-Old */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/85 border border-amber-400/40 text-[10px] font-black text-amber-300 shadow-md">
        <span className="text-sm">☀️</span>
        <span>{isDay ? (lat === 40.4093 ? 'Gündüz Şüaları ☀️' : 'Daylight ☀️') : 'Gündüz Tərəfi'}</span>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/85 border border-indigo-400/40 text-[10px] font-black text-indigo-300 shadow-md">
        <span className="text-sm">🌙</span>
        <span>{isDay ? 'Gecə Tərəfi' : 'Qaranlıq Gecə 🌙'}</span>
      </div>

      {/* Mehin's Position Pin Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 border-2 border-pink-500 shadow-xl text-[11px] font-black text-white whitespace-nowrap">
        <span className="text-base">{avatarEmoji}</span>
        <span className="text-pink-300">{explorerName}</span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-300">📍 {cityName}</span>
        <span className="text-slate-400">•</span>
        <span className={isDay ? 'text-amber-300' : 'text-indigo-300'}>
          {isDay ? 'İndi Gündüzdür ☀️' : 'İndi Gecədir 🌙'}
        </span>
      </div>

      {/* Swipe hint */}
      <p className="text-[9px] text-slate-400 mt-1 font-medium">
        👆 Barmağınla toxunub Yer kürəsini fırlada bilərsən!
      </p>
    </div>
  );
}
