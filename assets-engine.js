/* ==========================================================================
   AEGYRA: PROCEDURAL CLASSICAL OIL MATTE PAINTING & STEGANOGRAPHY ENGINE
   1. Synthesizes zero-slop classical architectural & prehistoric oil plates
      inspired by James Gurney (Dinotopia), Thomas Cole, and Ghibli art.
   2. Generates paired grayscale Z-depth maps for 2.5D parallax displacement.
   3. Embeds an INVISIBLE LSB (Least Significant Bit) steganographic watermark
      in every canvas so normal visitors see zero watermark, while the author
      signature can be verified cryptographically bit-by-bit.
   ========================================================================== */

export const STEGO_SIGNATURE = "AEGYRA::SANCTUM::ARNAB-DEBNATH::GH-300543148::VERIFIED-ORIGIN::2026";
const STEGO_MAGIC_HEADER = "AEGYRA_LSB_V1|";

/**
 * Encodes an invisible message into the Least Significant Bits (LSB) of the
 * Red, Green, and Blue channels in row 0..N of a 2D canvas context.
 * Maximum visual alteration is +-1/255 (0.39%), completely imperceptible to human eyes.
 */
export function encodeStegoWatermark(ctx, message = STEGO_SIGNATURE) {
  const payload = STEGO_MAGIC_HEADER + message + "|END";
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const bits = [];
  for (let i = 0; i < payload.length; i++) {
    const code = payload.charCodeAt(i) & 0xff;
    for (let b = 7; b >= 0; b--) {
      bits.push((code >> b) & 1);
    }
  }

  let bitIdx = 0;
  for (let p = 0; p < data.length && bitIdx < bits.length; p += 4) {
    // Embed in R, G, B least significant bits, leave Alpha 255 untouched
    for (let c = 0; c < 3 && bitIdx < bits.length; c++) {
      data[p + c] = (data[p + c] & 0xfe) | bits[bitIdx];
      bitIdx++;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return {
    bitsEmbedded: bits.length,
    payloadLength: payload.length,
    signature: message
  };
}

/**
 * Reads and decodes the invisible LSB steganographic watermark from any canvas.
 */
export function decodeStegoWatermark(canvas) {
  const ctx = canvas.getContext("2d");
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const maxChars = 160;
  const totalBits = maxChars * 8;
  const bits = [];

  for (let p = 0; p < data.length && bits.length < totalBits; p += 4) {
    for (let c = 0; c < 3 && bits.length < totalBits; c++) {
      bits.push(data[p + c] & 1);
    }
  }

  let decoded = "";
  for (let i = 0; i + 7 < bits.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i + b];
    }
    if (byte >= 32 && byte <= 126) {
      decoded += String.fromCharCode(byte);
    } else {
      break;
    }
  }

  if (decoded.startsWith(STEGO_MAGIC_HEADER)) {
    const clean = decoded.slice(STEGO_MAGIC_HEADER.length).split("|END")[0];
    return {
      verified: true,
      signature: clean,
      rawHeader: STEGO_MAGIC_HEADER.replace("|", ""),
      bitDepth: "1-bit LSB RGB Channel Encoding (Delta <= 0.39%)"
    };
  }

  return {
    verified: false,
    signature: "Unverified surface",
    rawHeader: "NONE",
    bitDepth: "N/A"
  };
}

/**
 * Adds tactile oil-on-linen canvas weave and painterly brushwork impasto
 * so every plate reads like a 19th-century Hudson River School / Dinotopia painting.
 */
function applyOilImpastoTexture(ctx, width, height, seed = 1) {
  ctx.save();
  // Linen weave horizontal & vertical micro-threads
  ctx.strokeStyle = "rgba(245, 236, 215, 0.035)";
  ctx.lineWidth = 1;
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let x = 0; x < width; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Painterly dabs & warm varnish glazing
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let i = 0; i < 420; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const w = 8 + rand() * 26;
    const h = 2 + rand() * 6;
    const angle = (rand() - 0.5) * 0.4;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = i % 2 === 0
      ? "rgba(238, 219, 178, 0.03)"
      : "rgba(19, 18, 9, 0.04)";
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Draws classical Greco-Roman colonnades, viaduct arches, waterfalls, and sauropod silhouettes
 * tailored to the specific scene preset.
 */
export function renderClassicalMattePlate(canvas, sceneKey = "citadel") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  const palettes = {
    citadel: {
      skyTop: "#1A2C38",
      skyMid: "#3E5D66",
      skyHorizon: "#E6C78E",
      mountainFar: "#273D40",
      mountainMid: "#1F332B",
      stoneLight: "#E5D5B5",
      stoneShadow: "#6E5D46",
      water: "#1C4E54",
      foliage: "#1A291E",
      banner: "#7C281E"
    },
    caldera: {
      skyTop: "#142630",
      skyMid: "#2A545E",
      skyHorizon: "#D9C389",
      mountainFar: "#1D3C38",
      mountainMid: "#284B32",
      stoneLight: "#D7C7A8",
      stoneShadow: "#524838",
      water: "#134B5F",
      foliage: "#162A18",
      banner: "#8B5E2B"
    },
    companions: {
      skyTop: "#1E2832",
      skyMid: "#4F5A58",
      skyHorizon: "#E8BA78",
      mountainFar: "#38413E",
      mountainMid: "#2B3529",
      stoneLight: "#E8D6B3",
      stoneShadow: "#6A563E",
      water: "#25494C",
      foliage: "#192218",
      banner: "#842B1D"
    },
    observatory: {
      skyTop: "#0D1622",
      skyMid: "#1D3248",
      skyHorizon: "#C9A66B",
      mountainFar: "#1B2936",
      mountainMid: "#182622",
      stoneLight: "#DFCFAE",
      stoneShadow: "#594D3C",
      water: "#12343D",
      foliage: "#0F1812",
      banner: "#73261B"
    },
    forests: {
      skyTop: "#152621",
      skyMid: "#2F5244",
      skyHorizon: "#D4C48E",
      mountainFar: "#1F3B2E",
      mountainMid: "#172E22",
      stoneLight: "#D8C9A7",
      stoneShadow: "#4F4636",
      water: "#16443E",
      foliage: "#0E1F14",
      banner: "#6E4720"
    },
    cliffs: {
      skyTop: "#1F2633",
      skyMid: "#495464",
      skyHorizon: "#EBC386",
      mountainFar: "#2F3844",
      mountainMid: "#29302B",
      stoneLight: "#EDE0C4",
      stoneShadow: "#6B5B45",
      water: "#1F4452",
      foliage: "#1A221B",
      banner: "#872A1E"
    }
  };

  const pal = palettes[sceneKey] || palettes.citadel;

  // 1. Atmospheric oil sky inside the artwork canvas
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  skyGrad.addColorStop(0, pal.skyTop);
  skyGrad.addColorStop(0.52, pal.skyMid);
  skyGrad.addColorStop(1, pal.skyHorizon);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Crepuscular sunbeams & volumetric clouds
  ctx.save();
  const sunX = sceneKey === "caldera" ? w * 0.38 : w * 0.72;
  const sunY = h * 0.24;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, w * 0.02, sunX, sunY, w * 0.55);
  sunGlow.addColorStop(0, "rgba(255, 243, 209, 0.78)");
  sunGlow.addColorStop(0.35, "rgba(232, 194, 125, 0.28)");
  sunGlow.addColorStop(1, "rgba(232, 194, 125, 0)");
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, w, h);

  // Cumulus painterly cloud banks
  const cloudCenters = [
    [w * 0.18, h * 0.18, w * 0.16],
    [w * 0.32, h * 0.15, w * 0.19],
    [w * 0.65, h * 0.16, w * 0.18],
    [w * 0.82, h * 0.22, w * 0.15]
  ];
  cloudCenters.forEach(([cx, cy, cr]) => {
    const cg = ctx.createRadialGradient(cx, cy - cr * 0.2, cr * 0.1, cx, cy, cr);
    cg.addColorStop(0, "rgba(249, 239, 216, 0.52)");
    cg.addColorStop(0.6, "rgba(195, 178, 148, 0.22)");
    cg.addColorStop(1, "rgba(62, 93, 102, 0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 3. Distant jagged alpine peaks (Cathedral crags)
  ctx.fillStyle = pal.mountainFar;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  ctx.lineTo(w * 0.14, h * 0.28);
  ctx.lineTo(w * 0.27, h * 0.44);
  ctx.lineTo(w * 0.44, h * 0.16);
  ctx.lineTo(w * 0.61, h * 0.38);
  ctx.lineTo(w * 0.79, h * 0.19);
  ctx.lineTo(w * 0.94, h * 0.35);
  ctx.lineTo(w, h * 0.31);
  ctx.lineTo(w, h * 0.75);
  ctx.lineTo(0, h * 0.75);
  ctx.closePath();
  ctx.fill();

  // Sunlit snow/limestone ridge facets on distant peaks
  ctx.fillStyle = "rgba(238, 221, 186, 0.22)";
  ctx.beginPath();
  ctx.moveTo(w * 0.44, h * 0.16);
  ctx.lineTo(w * 0.52, h * 0.38);
  ctx.lineTo(w * 0.41, h * 0.39);
  ctx.closePath();
  ctx.fill();

  // 4. Midground terraced emerald cliffs
  ctx.fillStyle = pal.mountainMid;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.54);
  ctx.lineTo(w * 0.22, h * 0.46);
  ctx.lineTo(w * 0.48, h * 0.51);
  ctx.lineTo(w * 0.74, h * 0.34);
  ctx.lineTo(w, h * 0.38);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // 5. Classical Acropolis Rotunda & Temple Colonnade on the upper cliff
  const templeX = w * 0.64;
  const templeY = h * 0.29;
  const templeW = w * 0.26;
  const templeH = h * 0.14;

  // Temple base stylobate
  ctx.fillStyle = pal.stoneShadow;
  ctx.fillRect(templeX - 8, templeY + templeH, templeW + 16, h * 0.08);
  ctx.fillStyle = pal.stoneLight;
  ctx.fillRect(templeX, templeY, templeW, templeH * 0.22);

  // Pediment & dome
  ctx.beginPath();
  ctx.moveTo(templeX - 6, templeY);
  ctx.lineTo(templeX + templeW / 2, templeY - templeH * 0.45);
  ctx.lineTo(templeX + templeW + 6, templeY);
  ctx.closePath();
  ctx.fillStyle = pal.stoneLight;
  ctx.fill();

  // Temple columns
  const colCount = 9;
  const colStep = templeW / colCount;
  for (let i = 0; i < colCount; i++) {
    const cx = templeX + i * colStep + colStep * 0.2;
    ctx.fillStyle = pal.stoneLight;
    ctx.fillRect(cx, templeY + templeH * 0.22, colStep * 0.55, templeH * 0.78);
    ctx.fillStyle = pal.stoneShadow;
    ctx.fillRect(cx + colStep * 0.35, templeY + templeH * 0.22, colStep * 0.2, templeH * 0.78);
  }

  // 6. Cascading Waterfalls (White/Teal vertical ribbons with mist)
  const falls = [
    [w * 0.54, h * 0.48, w * 0.04, h * 0.34],
    [w * 0.67, h * 0.42, w * 0.06, h * 0.40],
    [w * 0.78, h * 0.44, w * 0.045, h * 0.38]
  ];
  falls.forEach(([fx, fy, fw, fh]) => {
    const fg = ctx.createLinearGradient(fx, fy, fx, fy + fh);
    fg.addColorStop(0, "rgba(244, 248, 246, 0.85)");
    fg.addColorStop(0.6, "rgba(182, 219, 217, 0.65)");
    fg.addColorStop(1, "rgba(218, 235, 232, 0.15)");
    ctx.fillStyle = fg;
    ctx.fillRect(fx, fy, fw, fh);

    // Waterfall base mist bloom
    const mg = ctx.createRadialGradient(fx + fw / 2, fy + fh, 4, fx + fw / 2, fy + fh, fw * 2.4);
    mg.addColorStop(0, "rgba(240, 244, 238, 0.55)");
    mg.addColorStop(1, "rgba(240, 244, 238, 0)");
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(fx + fw / 2, fy + fh, fw * 2.4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 7. Sunken Turquoise Lagoon / River Basin at Bottom
  const waterTop = h * 0.74;
  const waterGrad = ctx.createLinearGradient(0, waterTop, 0, h);
  waterGrad.addColorStop(0, pal.water);
  waterGrad.addColorStop(1, "#0B1F24");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, waterTop, w, h - waterTop);

  // Water specular shimmer lines
  ctx.fillStyle = "rgba(238, 219, 172, 0.25)";
  for (let i = 0; i < 28; i++) {
    const wy = waterTop + (i / 28) * (h - waterTop);
    const ww = 24 + (i % 5) * 18;
    const wx = (w * 0.35) + Math.sin(i * 1.7) * (w * 0.22);
    ctx.fillRect(wx, wy, ww, 2);
  }

  // 8. Monumental Multi-Arched Roman Aqueduct Bridge spanning the valley
  const bridgeY = h * 0.58;
  const bridgeH = h * 0.20;
  ctx.fillStyle = pal.stoneShadow;
  ctx.fillRect(w * 0.05, bridgeY, w * 0.82, bridgeH);
  ctx.fillStyle = pal.stoneLight;
  ctx.fillRect(w * 0.05, bridgeY, w * 0.82, bridgeH * 0.18);

  // Carve arches out of the bridge
  const archCount = 6;
  const archSpan = (w * 0.76) / archCount;
  for (let a = 0; a < archCount; a++) {
    const ax = w * 0.08 + a * archSpan + archSpan * 0.5;
    const ay = bridgeY + bridgeH * 0.55;
    const ar = archSpan * 0.34;
    ctx.fillStyle = pal.mountainMid;
    ctx.beginPath();
    ctx.arc(ax, ay, ar, Math.PI, 0, false);
    ctx.lineTo(ax + ar, bridgeY + bridgeH + 2);
    ctx.lineTo(ax - ar, bridgeY + bridgeH + 2);
    ctx.closePath();
    ctx.fill();
  }

  // 9. Gentle Long-Necked Sauropod Giant & Scholars on the Viaduct (Dinotopia & Aegyra motif)
  const dinoX = w * 0.28;
  const dinoY = bridgeY;
  ctx.save();
  ctx.fillStyle = "#3A3628";
  // Body
  ctx.beginPath();
  ctx.ellipse(dinoX, dinoY - h * 0.045, w * 0.065, h * 0.038, -0.08, 0, Math.PI * 2);
  ctx.fill();
  // Four columnar legs
  const legPositions = [-0.045, -0.02, 0.02, 0.045];
  legPositions.forEach((lx) => {
    ctx.fillRect(dinoX + w * lx, dinoY - h * 0.04, w * 0.014, h * 0.042);
  });
  // Sweeping long neck & head
  ctx.beginPath();
  ctx.moveTo(dinoX + w * 0.04, dinoY - h * 0.06);
  ctx.quadraticCurveTo(dinoX + w * 0.11, dinoY - h * 0.17, dinoX + w * 0.16, dinoY - h * 0.19);
  ctx.quadraticCurveTo(dinoX + w * 0.185, dinoY - h * 0.19, dinoX + w * 0.18, dinoY - h * 0.175);
  ctx.quadraticCurveTo(dinoX + w * 0.12, dinoY - h * 0.14, dinoX + w * 0.06, dinoY - h * 0.035);
  ctx.closePath();
  ctx.fill();
  // Sweeping tail
  ctx.beginPath();
  ctx.moveTo(dinoX - w * 0.055, dinoY - h * 0.05);
  ctx.quadraticCurveTo(dinoX - w * 0.14, dinoY - h * 0.03, dinoX - w * 0.19, dinoY - h * 0.01);
  ctx.quadraticCurveTo(dinoX - w * 0.13, dinoY - h * 0.015, dinoX - w * 0.05, dinoY - h * 0.03);
  ctx.closePath();
  ctx.fill();

  // Robed human companions walking beside the giant on the bridge
  for (let p = 0; p < 4; p++) {
    const px = dinoX + w * (0.09 + p * 0.038);
    ctx.fillStyle = "#2A2118";
    ctx.fillRect(px, dinoY - h * 0.022, 4, h * 0.022);
    ctx.fillStyle = pal.banner;
    ctx.beginPath();
    ctx.arc(px + 2, dinoY - h * 0.025, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 10. Foreground Classical Corinthian Column & Crimson Senate Banner (Left)
  if (sceneKey === "citadel" || sceneKey === "companions") {
    const colW = w * 0.09;
    ctx.fillStyle = pal.stoneShadow;
    ctx.fillRect(0, 0, colW, h);
    ctx.fillStyle = pal.stoneLight;
    ctx.fillRect(colW * 0.15, 0, colW * 0.45, h);

    // Crimson & Gold Laurel Banner hanging from column
    const bx = colW * 0.85;
    const by = h * 0.18;
    const bw = w * 0.065;
    const bh = h * 0.28;
    ctx.fillStyle = pal.banner;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + bw, by);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw * 0.5, by + bh * 0.84);
    ctx.lineTo(bx, by + bh);
    ctx.closePath();
    ctx.fill();

    // Gold emblem on banner
    ctx.strokeStyle = "#E6CA94";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx + bw * 0.5, by + bh * 0.42, bw * 0.28, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 11. Foreground Lush Botanical Silhouette Frame
  ctx.fillStyle = pal.foliage;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.84);
  ctx.quadraticCurveTo(w * 0.15, h * 0.88, w * 0.28, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w, h * 0.82);
  ctx.quadraticCurveTo(w * 0.84, h * 0.87, w * 0.72, h);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // 12. Apply tactile oil-impasto canvas texture
  applyOilImpastoTexture(ctx, w, h, sceneKey.length);

  // 13. Embed INVISIBLE LSB Steganographic Watermark into pixel buffer
  encodeStegoWatermark(ctx, `${STEGO_SIGNATURE}::PLATE-${sceneKey.toUpperCase()}`);
}

/**
 * Generates a paired grayscale Z-depth map canvas (0 = far sky, 255 = near archway)
 * for the Three.js 2.5D displacement shader.
 */
export function renderDepthMapCanvas(width = 1024, height = 640) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Sky (Far = dark gray 20)
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#141414");
  bg.addColorStop(0.5, "#383838");
  bg.addColorStop(1, "#888888");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Distant mountains (Mid-far = 75)
  ctx.fillStyle = "#525252";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.62);
  ctx.lineTo(width * 0.44, height * 0.16);
  ctx.lineTo(width * 0.79, height * 0.19);
  ctx.lineTo(width, height * 0.35);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Viaduct & Citadel (Mid-near = 150)
  ctx.fillStyle = "#9A9A9A";
  ctx.fillRect(width * 0.05, height * 0.56, width * 0.85, height * 0.24);
  ctx.fillRect(width * 0.62, height * 0.26, width * 0.28, height * 0.30);

  // Foreground Archway Pillars (Near = 240)
  ctx.fillStyle = "#F0F0F0";
  ctx.fillRect(0, 0, width * 0.09, height);
  ctx.fillRect(width * 0.91, 0, width * 0.09, height);

  return canvas;
}
