import * as THREE from 'three';

/**
 * Creates high-detail procedural landmass vector paths mapped onto equirectangular coordinates (2048x1024)
 * Based on accurate geographic landmasses, natural terrain relief, and realistic ocean shelf depths.
 */
export function createEquirectangularEarthCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Deep Oceanic Gradient with continental shelf falloffs
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0.0, '#0a2342'); // Arctic Ocean
  oceanGrad.addColorStop(0.2, '#0d3b66');
  oceanGrad.addColorStop(0.5, '#05294a'); // Tropical Abyss
  oceanGrad.addColorStop(0.8, '#0d3b66');
  oceanGrad.addColorStop(1.0, '#0a2342'); // Antarctic Ocean
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Function to convert Longitude (-180 to 180) and Latitude (90 to -90) to canvas (x, y)
  const mapCoord = (lng, lat) => {
    const x = ((lng + 180) / 360) * 2048;
    const y = ((90 - lat) / 180) * 1024;
    return [x, y];
  };

  const drawPolygon = (points, fillColor, strokeColor = null) => {
    if (!points || points.length === 0) return;
    ctx.beginPath();
    const [startX, startY] = mapCoord(points[0][0], points[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < points.length; i++) {
      const [px, py] = mapCoord(points[i][0], points[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  // Coastal Shallow Waters / Turquoise Continental Shelf Glow
  const shelfColor = 'rgba(14, 165, 233, 0.28)';

  // 2. High-Accuracy Continents Geo-Coordinates
  // North America
  const northAmerica = [
    [-168, 65], [-160, 71], [-140, 70], [-125, 75], [-95, 76], [-82, 82],
    [-65, 83], [-60, 60], [-55, 50], [-65, 44], [-75, 35], [-80, 25],
    [-82, 23], [-88, 21], [-97, 26], [-97, 18], [-85, 10], [-77, 8],
    [-83, 10], [-105, 20], [-110, 23], [-115, 30], [-124, 38], [-124, 48],
    [-130, 55], [-140, 60], [-165, 60], [-168, 65]
  ];

  // South America
  const southAmerica = [
    [-77, 8], [-72, 11], [-60, 10], [-50, 0], [-35, -5], [-35, -12],
    [-40, -22], [-50, -30], [-58, -38], [-65, -45], [-68, -55], [-75, -50],
    [-73, -40], [-72, -30], [-70, -18], [-80, -5], [-77, 8]
  ];

  // Europe
  const europe = [
    [-9, 36], [-9, 43], [0, 44], [-5, 48], [-1, 50], [5, 53], [8, 57],
    [5, 62], [15, 68], [28, 71], [35, 68], [30, 60], [24, 55], [14, 54],
    [15, 45], [12, 38], [20, 37], [25, 40], [28, 41], [35, 47], [40, 42],
    [30, 36], [20, 37], [0, 36], [-9, 36]
  ];

  // Asia (including Caucasus, Caspian, Baku region)
  const asia = [
    [30, 60], [40, 65], [60, 70], [80, 73], [100, 76], [120, 73], [140, 72],
    [170, 67], [180, 65], [160, 55], [145, 45], [130, 35], [120, 32], [110, 20],
    [105, 10], [98, 10], [90, 22], [80, 15], [75, 25], [68, 25], [60, 25],
    [50, 30], [50, 40], [40, 42], [35, 47], [30, 60]
  ];

  // Africa
  const africa = [
    [-17, 15], [-17, 21], [-10, 30], [-5, 36], [10, 37], [25, 32], [32, 31],
    [35, 28], [43, 12], [51, 10], [42, -5], [36, -20], [32, -28], [26, -34],
    [18, -34], [12, -18], [9, -5], [4, 5], [-5, 5], [-15, 11], [-17, 15]
  ];

  // Australia
  const australia = [
    [114, -22], [120, -18], [130, -13], [142, -11], [146, -18], [153, -28],
    [150, -37], [140, -38], [130, -32], [115, -34], [114, -22]
  ];

  // Antarctica & Greenland
  const antarctica = [
    [-180, -75], [180, -75], [180, -90], [-180, -90]
  ];
  const greenland = [
    [-45, 60], [-35, 65], [-20, 75], [-30, 83], [-55, 82], [-55, 70], [-45, 60]
  ];

  // Draw Shallow Continental Shelves First
  [northAmerica, southAmerica, europe, asia, africa, australia].forEach(poly => {
    drawPolygon(poly, shelfColor, 'rgba(56, 189, 248, 0.4)');
  });

  // Base Landmass Colors: Rich earthy greens and fertile plains
  const landGreen = '#2e7d32'; // Organic lush foliage
  const desertGold = '#c29b38'; // Sahara, Arabia, Gobi
  const mountainBrown = '#5d4037'; // Himalayas, Rockies, Andes

  // Draw Continents Base
  drawPolygon(northAmerica, landGreen);
  drawPolygon(southAmerica, landGreen);
  drawPolygon(europe, '#388e3c');
  drawPolygon(asia, landGreen);
  drawPolygon(africa, desertGold); // Base Sahara
  drawPolygon(australia, '#b45309'); // Outback warm red/ochre

  // Africa Central & South Rainforest Green
  const centralAfrica = [
    [-10, 8], [40, 8], [38, -20], [15, -20], [9, -5], [-10, 8]
  ];
  drawPolygon(centralAfrica, '#1b5e20');

  // Amazon Basin Deep Green
  const amazonBasin = [
    [-75, 4], [-50, 2], [-45, -10], [-60, -15], [-75, -5], [-75, 4]
  ];
  drawPolygon(amazonBasin, '#14532d');

  // Middle East / Sahara Desert Zones
  const middleEastDesert = [
    [32, 32], [58, 30], [55, 18], [42, 14], [35, 25], [32, 32]
  ];
  drawPolygon(middleEastDesert, '#d97706');

  // Mountain Ranges (Himalayas, Tibetan Plateau)
  const himalayas = [
    [72, 36], [95, 35], [92, 28], [75, 30], [72, 36]
  ];
  drawPolygon(himalayas, mountainBrown);

  // Polar Ice Caps (Pure Crystal Glacial White)
  drawPolygon(antarctica, '#f8fafc');
  drawPolygon(greenland, '#f1f5f9');

  // Arctic Sea Ice
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 2048, 48);

  // 3. Subtle Realistic Atmospheric Cloud Belts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.26)';
  // Tropical trade wind swirling cloud bands
  for (let i = 0; i < 60; i++) {
    const cx = (i * 35) % 2048;
    const cy = 200 + Math.sin(i * 0.4) * 160 + (i % 7) * 45;
    const rx = 40 + (i % 6) * 15;
    const ry = 8 + (i % 3) * 6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.sin(i) * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

/**
 * Creates accurate Night City Lights texture mapped onto identical equirectangular coordinates
 */
export function createEquirectangularNightCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep space black base
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 2048, 1024);

  const mapCoord = (lng, lat) => {
    const x = ((lng + 180) / 360) * 2048;
    const y = ((90 - lat) / 180) * 1024;
    return [x, y];
  };

  const drawCityCluster = (lng, lat, radiusPx, density, color = '#fde047') => {
    const [cx, cy] = mapCoord(lng, lat);
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.7) * radiusPx;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const r = Math.random() * 1.5 + 0.6;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Major Global Urban Night Lights (True Earth at Night geography)
  // Baku / Caspian Corridor
  drawCityCluster(49.8671, 40.4093, 20, 45, '#fef08a'); // Baku Absheron
  drawCityCluster(44.8, 41.7, 14, 25); // Tbilisi
  drawCityCluster(44.5, 40.2, 14, 25); // Yerevan
  drawCityCluster(51.4, 35.7, 24, 50); // Tehran
  drawCityCluster(28.9, 41.0, 30, 65, '#fef08a'); // Istanbul

  // Western & Central Europe Corridor
  drawCityCluster(2.35, 48.85, 30, 60); // Paris
  drawCityCluster(-0.12, 51.5, 32, 65); // London
  drawCityCluster(13.4, 52.5, 24, 45); // Berlin
  drawCityCluster(12.5, 41.9, 20, 35); // Rome
  drawCityCluster(4.9, 52.3, 25, 45); // Netherlands / Belgium corridor
  drawCityCluster(37.6, 55.7, 28, 55); // Moscow

  // US East Coast Megalopolis
  drawCityCluster(-74.0, 40.7, 40, 85, '#fef08a'); // New York / Boston / Philly / DC
  drawCityCluster(-87.6, 41.8, 30, 55); // Chicago
  drawCityCluster(-80.2, 25.7, 22, 40); // Florida / Miami
  drawCityCluster(-95.3, 29.7, 24, 45); // Texas / Houston / Dallas

  // US West Coast
  drawCityCluster(-122.3, 47.6, 25, 50, '#fef08a'); // Seattle
  drawCityCluster(-122.4, 37.7, 28, 55); // San Francisco Bay Area
  drawCityCluster(-118.2, 34.0, 35, 70); // Los Angeles

  // Asia / Japan / China / India
  drawCityCluster(139.7, 35.7, 45, 95, '#fef08a'); // Tokyo metropolitan
  drawCityCluster(121.5, 31.2, 38, 75); // Shanghai
  drawCityCluster(114.1, 22.3, 30, 60); // Hong Kong / Pearl River
  drawCityCluster(77.2, 28.6, 35, 70); // New Delhi
  drawCityCluster(72.8, 19.0, 32, 60); // Mumbai

  // South America & Australia
  drawCityCluster(-46.6, -23.5, 32, 55); // Sao Paulo
  drawCityCluster(-58.4, -34.6, 28, 50); // Buenos Aires
  drawCityCluster(151.2, -33.8, 26, 45); // Sydney

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

/**
 * Creates high-detail Moon texture with actual lunar maria and impact craters
 */
export function createDetailedMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Moon light grey base regolith
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, 1024, 512);

  // Lunar Maria (Dark basaltic plains: Sea of Tranquility, Ocean of Storms)
  ctx.fillStyle = '#64748b';
  const drawMare = (cx, cy, rx, ry, rot) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  };

  drawMare(360, 200, 95, 75, 0.2); // Oceanus Procellarum
  drawMare(520, 210, 75, 60, -0.1); // Mare Imbrium
  drawMare(620, 240, 60, 50, 0.3); // Mare Serenitatis
  drawMare(680, 270, 55, 45, -0.2); // Mare Tranquillitatis
  drawMare(480, 320, 65, 45, 0.1); // Mare Nubium

  // Impact Craters with ray systems (Tycho, Copernicus)
  const drawCrater = (x, y, radius, rayLength = 0) => {
    // Rays
    if (rayLength > 0) {
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.4)';
      ctx.lineWidth = 1.2;
      for (let a = 0; a < 8; a++) {
        const angle = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * rayLength, y + Math.sin(angle) * rayLength);
        ctx.stroke();
      }
    }
    // Crater Rim
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    // Shadow interior
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(x - radius * 0.2, y, radius * 0.7, 0, Math.PI * 2);
    ctx.fill();
  };

  // Major lunar impact craters
  drawCrater(480, 390, 8, 45); // Tycho with rays
  drawCrater(440, 230, 6, 25); // Copernicus
  drawCrater(520, 260, 5, 20); // Kepler
  drawCrater(700, 220, 7, 30); // Aristoteles

  // Micro craters scattering
  for (let i = 0; i < 80; i++) {
    const x = (i * 47) % 1024;
    const y = (i * 37) % 512;
    const r = (i % 4) * 1.2 + 1.5;
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
