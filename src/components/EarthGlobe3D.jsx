import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createEquirectangularEarthCanvas, createEquirectangularNightCanvas, createDetailedMoonTexture } from '../utils/earthTextures';

/**
 * Premium Apple / Pixar Quality Live Earth & Sky Viewport
 * Physically accurate Day/Night lighting, atmospheric Fresnel scatter, illuminated night city lights,
 * real lunar phase angle, glowing location beacon, and smooth touch drag interaction.
 */
export function EarthGlobe3D({
  lat = 40.4093,
  lng = 49.8671,
  isDay = true,
  dayProgress = 50,
  cityName = 'Baku',
  explorerName = 'Mehin',
  avatarEmoji = '🧑‍🚀',
  moonPhaseFraction = 0.5,
  isEn = true,
  onInspect = null,
}) {
  const containerRef = useRef(null);
  const [userInteracting, setUserInteracting] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 360;
    // Premium cinematic height (occupies ~58% of viewport frame)
    const height = Math.min(320, Math.max(260, window.innerHeight * 0.35));

    // 1. Scene & Cinematic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.15, 4.4);

    // 2. High-Performance Anti-Aliased Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // 3. Earth Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthRadius = 1.35;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const dayTexture = createEquirectangularEarthCanvas();
    const nightTexture = createEquirectangularNightCanvas();

    // Custom Shaders for Apple-Grade Day/Night Blending & Atmospheric Scattering
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 norm = normalize(vNormal);
          vec3 sunDir = normalize(sunDirection);
          
          // Compute sunlight dot product
          float dotSun = dot(norm, sunDir);
          
          // Soft physical twilight terminator transition (-0.15 to 0.2)
          float dayFactor = smoothstep(-0.15, 0.25, dotSun);
          
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);
          
          // Warm sunset / dawn rim glow at twilight boundary
          float twilight = smoothstep(0.3, 0.0, abs(dotSun));
          vec3 sunsetGlow = vec3(0.98, 0.55, 0.2) * twilight * 0.45;
          
          // Blend day, night lights, and atmospheric scattering
          vec3 blended = mix(nightColor.rgb * 1.5, dayColor.rgb, dayFactor) + sunsetGlow;
          
          // Fresnel rim glow on the daytime edge
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(norm, viewDir), 0.0), 3.0);
          blended += vec3(0.2, 0.6, 1.0) * fresnel * dayFactor * 0.6;
          
          gl_FragColor = vec4(blended, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // 4. Atmospheric Blue Glow Halo (Fresnel outer shell)
    const atmosGeometry = new THREE.SphereGeometry(earthRadius * 1.035, 48, 48);
    const atmosMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 sunDirection;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float rim = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
          float sunSide = dot(vNormal, normalize(sunDirection)) * 0.5 + 0.5;
          vec3 color = mix(vec3(0.4, 0.2, 0.9), vec3(0.2, 0.65, 1.0), sunSide);
          gl_FragColor = vec4(color * rim * 1.2, rim * 0.85);
        }
      `,
    });
    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    earthGroup.add(atmosMesh);

    // 5. Sun ☀️ (Directional source & Visual Star in Space)
    // Physical Sun Angle: If it's day in this city, the sun is positioned directly in front/overhead
    const sunAngle = isDay ? (dayProgress / 100 - 0.5) * Math.PI * 0.8 : Math.PI;
    const sunDist = 12;
    const sunPos = new THREE.Vector3(
      Math.sin(sunAngle) * sunDist,
      0.6,
      Math.cos(sunAngle) * sunDist
    );

    earthMaterial.uniforms.sunDirection.value.copy(sunPos).normalize();
    atmosMaterial.uniforms.sunDirection.value.copy(sunPos).normalize();

    // Visual glowing Sun disc in the cosmic backdrop
    const sunMeshGroup = new THREE.Group();
    const sunGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const sunCore = new THREE.Mesh(sunGeo, sunMat);
    sunMeshGroup.add(sunCore);

    // Sun Corona Glow
    const coronaGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunMeshGroup.add(coronaMesh);

    // Position visual sun in camera perspective
    sunMeshGroup.position.set(
      isDay ? (dayProgress > 50 ? 2.4 : -2.4) : -3.5,
      1.3,
      isDay ? -1.5 : -4.0
    );
    scene.add(sunMeshGroup);

    // 6. Moon 🌙 (Physical body with realistic craters and current lunar phase)
    const moonRadius = 0.32;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonTexture = createDetailedMoonTexture();
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.92,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);

    // Moon Directional Sunlight
    const moonLight = new THREE.DirectionalLight(0xfffbeb, 2.8);
    moonLight.position.copy(sunPos);
    scene.add(moonLight);

    // Position Moon in orbit opposite or alongside
    const moonOrbitAngle = isDay ? -Math.PI * 0.65 : Math.PI * 0.25;
    moonMesh.position.set(
      Math.cos(moonOrbitAngle) * 2.6,
      0.35,
      Math.sin(moonOrbitAngle) * 2.6
    );
    scene.add(moonMesh);

    // 7. Mehin's Glowing City Beacon 📍
    // Spherical conversion of Latitude & Longitude to 3D Cartesian coordinates
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const pinR = earthRadius + 0.02;
    const pinX = -(pinR * Math.sin(phi) * Math.cos(theta));
    const pinZ = pinR * Math.sin(phi) * Math.sin(theta);
    const pinY = pinR * Math.cos(phi);

    const pinGroup = new THREE.Group();
    // Glowing Core
    const pinCoreGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const pinCoreMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const pinCore = new THREE.Mesh(pinCoreGeo, pinCoreMat);
    pinCore.position.set(pinX, pinY, pinZ);
    pinGroup.add(pinCore);

    // Pulsing Radar Rings
    const ringGeo = new THREE.RingGeometry(0.09, 0.13, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(pinX, pinY, pinZ);
    ringMesh.lookAt(pinX * 2, pinY * 2, pinZ * 2);
    pinGroup.add(ringMesh);

    earthMesh.add(pinGroup);

    // Orient Earth so that user's selected city is centered directly towards camera
    const initialYRotation = - (lng * (Math.PI / 180)) - Math.PI / 2;
    earthMesh.rotation.y = initialYRotation;
    earthMesh.rotation.x = (lat * (Math.PI / 180)) * 0.35; // Natural realistic tilt

    // 8. Intuitive Touch & Drag Control (Apple Map Globe smoothness)
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setUserInteracting(true);
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;

      earthMesh.rotation.y += deltaX * 0.0075;
      earthMesh.rotation.x = Math.max(-0.6, Math.min(0.6, earthMesh.rotation.x + deltaY * 0.004));

      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setUserInteracting(false), 2000);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 9. Animation Loop (60 FPS, silky smooth drift)
    let animationFrameId;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.035;

      // Gentle orbital drift when child isn't touching
      if (!isDragging) {
        earthMesh.rotation.y += 0.0008;
      }

      // Pulse city pin beacon
      const pulseScale = 1 + Math.sin(clock * 2) * 0.35;
      ringMesh.scale.set(pulseScale, pulseScale, pulseScale);
      ringMat.opacity = 0.45 + Math.cos(clock * 2) * 0.4;

      // Gentle floating animation of the Moon
      moonMesh.position.y = 0.35 + Math.sin(clock * 0.5) * 0.08;
      moonMesh.rotation.y += 0.001;

      // Sun soft pulsation
      const sunPulse = 1 + Math.sin(clock) * 0.04;
      sunMeshGroup.scale.set(sunPulse, sunPulse, sunPulse);

      renderer.render(scene, camera);
    };

    animate();

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
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosGeometry.dispose();
      atmosMaterial.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
    };
  }, [lat, lng, isDay, dayProgress]);

  return (
    <div className="relative w-full flex flex-col items-center select-none overflow-hidden rounded-3xl">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[280px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Floating Astronomical Labels in Space (Pixar / Apple style badges) */}
      {/* Sun Label */}
      <button
        onClick={() => setActiveTooltip('sun')}
        className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-950/70 border border-amber-400/40 text-amber-200 text-xs font-bold backdrop-blur-md shadow-lg active:scale-95 transition cursor-pointer"
      >
        <span className="text-sm animate-pulse">☀️</span>
        <span>{isEn ? 'Sunlight Side' : 'Günəş Şüaları'}</span>
      </button>

      {/* Moon Label */}
      <button
        onClick={() => setActiveTooltip('moon')}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-950/70 border border-indigo-400/40 text-indigo-200 text-xs font-bold backdrop-blur-md shadow-lg active:scale-95 transition cursor-pointer"
      >
        <span className="text-sm">🌙</span>
        <span>{isEn ? 'Moon in Orbit' : 'Səmadakı Ay'}</span>
      </button>

      {/* Floating Center Beacon: "Mehin is here!" */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-pink-500/50 shadow-2xl backdrop-blur-xl text-xs font-black text-white whitespace-nowrap">
        <span className="text-base">{avatarEmoji}</span>
        <span className="text-pink-300 font-extrabold">{explorerName}</span>
        <span className="text-slate-500">•</span>
        <span className="text-emerald-300 font-bold">📍 {cityName}</span>
        <span className="text-slate-500">•</span>
        <span className={isDay ? 'text-amber-300 font-extrabold' : 'text-indigo-300 font-extrabold'}>
          {isDay ? (isEn ? 'Daytime ☀️' : 'Gündüz ☀️') : (isEn ? 'Nighttime 🌙' : 'Gecə 🌙')}
        </span>
      </div>

      {/* Educational Interactive Popover (When Sun or Moon is tapped) */}
      {activeTooltip && (
        <div
          onClick={() => setActiveTooltip(null)}
          className="absolute inset-x-4 bottom-14 z-20 p-3 rounded-2xl bg-slate-900/95 border border-purple-400/50 shadow-2xl backdrop-blur-xl text-center cursor-pointer animate-in fade-in zoom-in-95 duration-200"
        >
          <p className="text-xs font-bold text-white">
            {activeTooltip === 'sun'
              ? (isEn
                ? '☀️ The Sun gives Earth light and warmth! When our side faces the Sun, it is daytime.'
                : '☀️ Günəş Yer kürəsinə işıq və istilik verir! Bizim tərəf Günəşə baxanda bizdə gündüz olur.')
              : (isEn
                ? '🌙 The Moon is Earth’s best friend in space! It circles around us every 29 days.'
                : '🌙 Ay Yer kürəsinin ən yaxın kosmik dostudur! O, hər 29 gündən bir bizim ətrafımızda tam dövr edir.')}
          </p>
          <span className="text-[10px] text-purple-300 mt-1 block font-medium">
            {isEn ? '(Tap to close)' : '(Bağlamaq üçün toxun)'}
          </span>
        </div>
      )}
    </div>
  );
}
