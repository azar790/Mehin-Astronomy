import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createEquirectangularEarthCanvas, createEquirectangularNightCanvas, createDetailedMoonTexture } from '../utils/earthTextures';

/**
 * Apple Astronomy-Grade 3D Scene
 * Pure, uncluttered deep-space viewport with a dominant photorealistic Earth,
 * directional solar lighting, orbiting Moon, and an elegant location beacon.
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
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 360;
    // Generous, dominant height: 380px gives the Earth physical majesty and breathability
    const height = 380;

    // 1. Scene & Cinematic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.3);

    // 2. High-Fidelity Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // 3. Earth Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthRadius = 1.45;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const dayTexture = createEquirectangularEarthCanvas();
    const nightTexture = createEquirectangularNightCanvas();

    // Custom Physical GLSL Shader for Apple Astronomy Day/Night Terminator
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 n = normalize(vNormal);
          vec3 s = normalize(sunDirection);
          float dotS = dot(n, s);

          // Physical twilight boundary
          float dayFactor = smoothstep(-0.12, 0.22, dotS);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Golden twilight glow along the terminator
          float twilight = smoothstep(0.25, 0.0, abs(dotS));
          vec3 twilightGlow = vec3(0.95, 0.55, 0.2) * twilight * 0.4;

          vec3 baseColor = mix(nightColor.rgb * 1.8, dayColor.rgb, dayFactor) + twilightGlow;

          // Subtle atmospheric rim Fresnel on daytime limb
          vec3 v = normalize(cameraPosition - vWorldPos);
          float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
          baseColor += vec3(0.25, 0.65, 1.0) * rim * dayFactor * 0.55;

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
    earthGroup.add(earthMesh);

    // 4. Soft Atmospheric Scattering Halo (Apple Weather style)
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.03, 48, 48);
    const atmosMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 sunDirection;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 v = normalize(cameraPosition - vWorldPos);
          float rim = pow(1.0 - max(dot(vNormal, v), 0.0), 2.8);
          float sunSide = dot(vNormal, normalize(sunDirection)) * 0.5 + 0.5;
          vec3 col = mix(vec3(0.2, 0.1, 0.7), vec3(0.3, 0.7, 1.0), sunSide);
          gl_FragColor = vec4(col * rim * 1.4, rim * 0.8);
        }
      `,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosMesh);

    // 5. Sun Light & Disc in Space
    const sunAngle = isDay ? (dayProgress / 100 - 0.5) * Math.PI * 0.75 : Math.PI;
    const sunDist = 14;
    const sunPos = new THREE.Vector3(
      Math.sin(sunAngle) * sunDist,
      0.4,
      Math.cos(sunAngle) * sunDist
    );

    earthMaterial.uniforms.sunDirection.value.copy(sunPos).normalize();
    atmosMaterial.uniforms.sunDirection.value.copy(sunPos).normalize();

    // Clean Sun Disc in the distance
    const sunGroup = new THREE.Group();
    const sunCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sunGroup.add(sunCore);

    // Soft Optical Lens Flare Glow around Sun
    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.28,
        side: THREE.BackSide,
      })
    );
    sunGroup.add(sunGlow);

    sunGroup.position.set(
      isDay ? (dayProgress > 50 ? 2.6 : -2.6) : -3.8,
      1.4,
      isDay ? -1.8 : -4.5
    );
    scene.add(sunGroup);

    // 6. Moon with Physical Crater Texture & Orbit
    const moonGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const moonTexture = createDetailedMoonTexture();
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.9,
      metalness: 0.0,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);

    const moonSunLight = new THREE.DirectionalLight(0xfffbeb, 2.6);
    moonSunLight.position.copy(sunPos);
    scene.add(moonSunLight);

    const moonOrbitAngle = isDay ? -Math.PI * 0.6 : Math.PI * 0.25;
    moonMesh.position.set(
      Math.cos(moonOrbitAngle) * 2.7,
      -0.2,
      Math.sin(moonOrbitAngle) * 2.7
    );
    scene.add(moonMesh);

    // 7. Mehin's Elegant Beacon on the Globe
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const pinR = earthRadius + 0.025;
    const pinX = -(pinR * Math.sin(phi) * Math.cos(theta));
    const pinZ = pinR * Math.sin(phi) * Math.sin(theta);
    const pinY = pinR * Math.cos(phi);

    const beaconGroup = new THREE.Group();

    // Refined Beacon Pin Dot
    const pinCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    pinCore.position.set(pinX, pinY, pinZ);
    beaconGroup.add(pinCore);

    // Warm Beacon Halo Ring
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.08, 0.12, 32),
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

    // Natural orientation toward user
    const initialRotY = - (lng * (Math.PI / 180)) - Math.PI / 2;
    earthMesh.rotation.y = initialRotY;
    earthMesh.rotation.x = (lat * (Math.PI / 180)) * 0.3;

    // 8. Smooth Touch & Drag Handling
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onStart = (e) => {
      isDragging = true;
      setIsInteracting(true);
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

      earthMesh.rotation.y += dx * 0.007;
      earthMesh.rotation.x = Math.max(-0.5, Math.min(0.5, earthMesh.rotation.x + dy * 0.004));

      prevX = cx;
      prevY = cy;
    };

    const onEnd = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2500);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    dom.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    // 9. Kinetic Render Loop
    let animId;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.03;

      if (!isDragging) {
        earthMesh.rotation.y += 0.0006;
      }

      // Elegant beacon breathing pulse
      const pulse = 1 + Math.sin(clock * 2.2) * 0.3;
      ringMesh.scale.set(pulse, pulse, pulse);
      ringMesh.material.opacity = 0.4 + Math.cos(clock * 2.2) * 0.4;

      // Subtle moon suspension in space
      moonMesh.position.y = -0.2 + Math.sin(clock * 0.4) * 0.06;
      moonMesh.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      camera.aspect = nw / height;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
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
      nightTexture.dispose();
    };
  }, [lat, lng, isDay, dayProgress]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D WebGL Canvas without borders or cards */}
      <div
        ref={mountRef}
        className="w-full h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
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
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white tracking-wide shadow-2xl">
        <span>{avatarEmoji}</span>
        <span className="text-white font-bold">{explorerName}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300">{cityName}</span>
      </div>
    </div>
  );
}
