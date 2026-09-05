import * as THREE from 'three';

/**
 * Creates an offline procedural high-res Earth Day texture (oceans, continents, greenery, polar ice)
 */
export function createProceduralEarthDayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep Blue Ocean Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0c4a6e');
  oceanGrad.addColorStop(0.25, '#0284c7');
  oceanGrad.addColorStop(0.5, '#0369a1');
  oceanGrad.addColorStop(0.75, '#0284c7');
  oceanGrad.addColorStop(1, '#0c4a6e');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Continents (approximate world map landmasses)
  ctx.fillStyle = '#15803d'; // Rich forest/land green

  // Helper for drawing continent shapes
  const drawLand = (coords) => {
    ctx.beginPath();
    ctx.moveTo(coords[0][0], coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i][0], coords[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  };

  // Eurasia (Europe + Asia)
  drawLand([
    [480, 100], [530, 95], [600, 100], [700, 110], [800, 120], [850, 160],
    [820, 220], [780, 250], [720, 280], [680, 260], [640, 220], [580, 200],
    [540, 240], [500, 230], [470, 180], [480, 140]
  ]);

  // Africa
  drawLand([
    [480, 220], [540, 230], [560, 280], [530, 360], [500, 400], [460, 320], [450, 260], [470, 220]
  ]);

  // North America
  drawLand([
    [120, 80], [220, 70], [290, 120], [260, 200], [210, 230], [180, 280],
    [160, 260], [130, 200], [90, 140]
  ]);

  // South America
  drawLand([
    [200, 280], [260, 300], [280, 350], [240, 440], [210, 460], [190, 380], [180, 320]
  ]);

  // Australia
  drawLand([
    [760, 330], [840, 320], [870, 370], [820, 420], [760, 390], [740, 350]
  ]);

  // Polar Ice Caps
  ctx.fillStyle = '#f8fafc';
  // North Pole
  ctx.fillRect(0, 0, 1024, 35);
  // Antarctica
  ctx.fillRect(0, 480, 1024, 32);

  // Soft Mountain / Desert Warm Tones
  ctx.fillStyle = '#ca8a04'; // Ochre desert for Sahara & central Asia
  ctx.beginPath();
  ctx.ellipse(500, 240, 35, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(650, 190, 45, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle clouds layer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  for (let i = 0; i < 40; i++) {
    const cx = (i * 27) % 1024;
    const cy = 60 + (i * 37) % 380;
    const rx = 30 + (i % 5) * 12;
    const ry = 10 + (i % 3) * 6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates an offline procedural high-res Earth Night texture (deep dark with glowing cities)
 */
export function createProceduralEarthNightTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Pitch dark night oceans & continents
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle landmass silhouettes
  ctx.fillStyle = '#0b1120';
  const drawLand = (coords) => {
    ctx.beginPath();
    ctx.moveTo(coords[0][0], coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i][0], coords[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  };

  drawLand([[480, 100], [530, 95], [600, 100], [700, 110], [800, 120], [850, 160], [820, 220], [780, 250], [720, 280], [680, 260], [640, 220], [580, 200], [540, 240], [500, 230], [470, 180], [480, 140]]);
  drawLand([[480, 220], [540, 230], [560, 280], [530, 360], [500, 400], [460, 320], [450, 260], [470, 220]]);
  drawLand([[120, 80], [220, 70], [290, 120], [260, 200], [210, 230], [180, 280], [160, 260], [130, 200], [90, 140]]);
  drawLand([[200, 280], [260, 300], [280, 350], [240, 440], [210, 460], [190, 380], [180, 320]]);
  drawLand([[760, 330], [840, 320], [870, 370], [820, 420], [760, 390], [740, 350]]);

  // Golden glowing city clusters
  ctx.fillStyle = '#fde047';
  const drawCityCluster = (cx, cy, radius, count) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const size = Math.random() * 2 + 0.8;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Major global population centers / bright city lights
  drawCityCluster(510, 170, 25, 40); // Europe
  drawCityCluster(540, 195, 12, 18); // Baku / Caucasus / Caspian
  drawCityCluster(530, 205, 15, 20); // Middle East
  drawCityCluster(680, 230, 30, 45); // India
  drawCityCluster(760, 210, 35, 50); // East Asia / China / Japan
  drawCityCluster(240, 160, 35, 45); // US East Coast / NY
  drawCityCluster(140, 150, 20, 25); // US West Coast / Seattle
  drawCityCluster(240, 340, 20, 20); // Brazil Coast

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates high quality Moon texture with craters
 */
export function createProceduralMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Moon grey base
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, 512, 256);

  // Dark lunar maria
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(180, 100, 45, 30, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(260, 120, 55, 40, -0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(320, 90, 30, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Craters
  ctx.fillStyle = '#64748b';
  for (let i = 0; i < 40; i++) {
    const x = (i * 31) % 512;
    const y = (i * 23) % 256;
    const r = (i % 6) * 1.8 + 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
