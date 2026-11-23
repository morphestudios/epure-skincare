import * as THREE from "three";

export type HeroTextures = {
  backdrop: THREE.CanvasTexture;
  contact: THREE.CanvasTexture;
  glassNormal: THREE.CanvasTexture;
  glassRoughness: THREE.CanvasTexture;
  glassThickness: THREE.CanvasTexture;
  brush: THREE.CanvasTexture;
};

function canvasTexture(
  canvas: HTMLCanvasElement,
  colorSpace: THREE.ColorSpace,
) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = colorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Editorial wash in the site palette: charcoal and espresso behind the
 * headline, easing into sand, taupe and warm ivory around the vessel.
 */
function createBackdrop() {
  const width = 2048;
  const height = 1152;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvasTexture(canvas, THREE.SRGBColorSpace);

  ctx.fillStyle = "#251a17";
  ctx.fillRect(0, 0, width, height);

  const field = ctx.createLinearGradient(0, height * 0.08, width, height * 0.92);
  field.addColorStop(0, "#1a1210");
  field.addColorStop(0.34, "#251a17");
  field.addColorStop(0.58, "#3d2b24");
  field.addColorStop(0.8, "#5c4338");
  field.addColorStop(1, "#765647");
  ctx.fillStyle = field;
  ctx.fillRect(0, 0, width, height);

  const pool = ctx.createRadialGradient(
    width * 0.72,
    height * 0.4,
    40,
    width * 0.7,
    height * 0.46,
    width * 0.34,
  );
  pool.addColorStop(0, "rgba(243, 238, 229, 0.14)");
  pool.addColorStop(0.5, "rgba(229, 216, 198, 0.08)");
  pool.addColorStop(1, "rgba(230, 221, 208, 0)");
  ctx.fillStyle = pool;
  ctx.fillRect(0, 0, width, height);

  const warmth = ctx.createRadialGradient(
    width * 0.2,
    height * 0.22,
    10,
    width * 0.28,
    height * 0.34,
    width * 0.32,
  );
  warmth.addColorStop(0, "rgba(230, 221, 208, 0.16)");
  warmth.addColorStop(1, "rgba(230, 221, 208, 0)");
  ctx.fillStyle = warmth;
  ctx.fillRect(0, 0, width, height);

  const floor = ctx.createLinearGradient(0, height * 0.62, 0, height);
  floor.addColorStop(0, "rgba(58, 47, 40, 0)");
  floor.addColorStop(1, "rgba(31, 27, 24, 0.28)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, width, height);

  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 16) {
    const grain = (Math.random() - 0.5) * 8;
    data[i] += grain;
    data[i + 1] += grain;
    data[i + 2] += grain;
  }
  ctx.putImageData(image, 0, 0);

  const texture = canvasTexture(canvas, THREE.SRGBColorSpace);
  texture.anisotropy = 4;
  return texture;
}

function createContactShadow() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvasTexture(canvas, THREE.SRGBColorSpace);
  const gradient = ctx.createRadialGradient(256, 256, 12, 256, 256, 248);
  gradient.addColorStop(0, "rgba(26, 18, 16, 0.46)");
  gradient.addColorStop(0.28, "rgba(37, 26, 23, 0.22)");
  gradient.addColorStop(0.62, "rgba(37, 26, 23, 0.08)");
  gradient.addColorStop(1, "rgba(32, 24, 20, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvasTexture(canvas, THREE.SRGBColorSpace);
}

function createGlassNormal() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const texture = canvasTexture(canvas, THREE.NoColorSpace);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.6, 1.4);
  if (!ctx) return texture;

  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      height[y * size + x] =
        Math.sin(u * Math.PI * 3.2 + v * 1.6) *
          Math.sin(v * Math.PI * 2.6) *
          0.7 +
        Math.sin(u * Math.PI * 8 + 1.3) * Math.sin(v * Math.PI * 6.4) * 0.18;
    }
  }

  const image = ctx.createImageData(size, size);
  const strength = 1.15;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const left = height[y * size + ((x - 1 + size) % size)];
      const right = height[y * size + ((x + 1) % size)];
      const down = height[((y - 1 + size) % size) * size + x];
      const up = height[((y + 1) % size) * size + x];
      const dx = (right - left) * strength;
      const dy = (up - down) * strength;
      const length = Math.hypot(-dx, -dy, 1);
      const pixel = (y * size + x) * 4;
      image.data[pixel] = (-dx / length) * 127 + 128;
      image.data[pixel + 1] = (-dy / length) * 127 + 128;
      image.data[pixel + 2] = (1 / length) * 127 + 128;
      image.data[pixel + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  texture.needsUpdate = true;
  return texture;
}

function createGlassRoughness() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const texture = canvasTexture(canvas, THREE.NoColorSpace);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  if (!ctx) return texture;
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const wave =
        0.92 +
        Math.sin(u * 11 + v * 4) * 0.04 +
        Math.sin(v * 17 + 2) * 0.025;
      const value = Math.round(Math.min(1, Math.max(0, wave)) * 255);
      const pixel = (y * size + x) * 4;
      image.data[pixel] = value;
      image.data[pixel + 1] = value;
      image.data[pixel + 2] = value;
      image.data[pixel + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  texture.needsUpdate = true;
  return texture;
}

/** Green channel: thick through the belly, thin at the neck and foot. */
function createGlassThickness() {
  const width = 64;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const texture = canvasTexture(canvas, THREE.NoColorSpace);
  if (!ctx) return texture;
  const image = ctx.createImageData(width, height);
  for (let y = 0; y < height; y += 1) {
    const t = 1 - y / (height - 1);
    const belly = smooth(0.08, 0.2, t) * (1 - smooth(0.7, 0.86, t));
    const amount = 0.2 + 0.8 * belly;
    const value = Math.round(amount * 255);
    for (let x = 0; x < width; x += 1) {
      const pixel = (y * width + x) * 4;
      image.data[pixel] = 0;
      image.data[pixel + 1] = value;
      image.data[pixel + 2] = 0;
      image.data[pixel + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  texture.needsUpdate = true;
  return texture;
}

function smooth(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function createBrush() {
  const width = 256;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const texture = canvasTexture(canvas, THREE.NoColorSpace);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 14);
  if (!ctx) return texture;
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 220; i += 1) {
    const y = Math.random() * height;
    const shade = 150 + Math.floor(Math.random() * 80);
    ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, 0.55)`;
    ctx.lineWidth = Math.random() > 0.8 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + (Math.random() - 0.5) * 1.5);
    ctx.stroke();
  }
  texture.needsUpdate = true;
  return texture;
}

export function createWordmarkTexture(fontFamily: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const family = fontFamily || "Georgia";
  ctx.font = `500 168px "${family}", Georgia, "Times New Roman", serif`;
  ctx.fillStyle = "rgba(255, 250, 244, 0.98)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const text = "ÉPURE";
  const glyphs = Array.from(text);
  const tracking = 22;
  const widths = glyphs.map((glyph) => ctx.measureText(glyph).width);
  const total =
    widths.reduce((sum, width) => sum + width, 0) +
    tracking * (glyphs.length - 1);
  let cursor = (canvas.width - total) / 2;
  const baseline = canvas.height * 0.52;
  glyphs.forEach((glyph, index) => {
    ctx.fillText(glyph, cursor + widths[index] / 2, baseline);
    cursor += widths[index] + tracking;
  });

  ctx.strokeStyle = "rgba(248, 244, 238, 0.72)";
  ctx.lineWidth = 2;
  const line = total * 0.62;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - line / 2, baseline - 78);
  ctx.lineTo(canvas.width / 2 + line / 2, baseline - 78);
  ctx.moveTo(canvas.width / 2 - line * 0.28, baseline + 78);
  ctx.lineTo(canvas.width / 2 + line * 0.28, baseline + 78);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.premultiplyAlpha = true;
  texture.needsUpdate = true;
  return texture;
}

export function createHeroTextures(): HeroTextures {
  return {
    backdrop: createBackdrop(),
    contact: createContactShadow(),
    glassNormal: createGlassNormal(),
    glassRoughness: createGlassRoughness(),
    glassThickness: createGlassThickness(),
    brush: createBrush(),
  };
}

export function disposeHeroTextures(textures: HeroTextures) {
  Object.values(textures).forEach((texture) => texture.dispose());
}
