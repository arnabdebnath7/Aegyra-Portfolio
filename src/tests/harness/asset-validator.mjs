/**
 * asset-validator.mjs
 * Validates availability, non-zero byte size, and binary RIFF/WEBP magic headers
 * for all 10 production WebP artwork assets in public/assets/images/
 */

import fs from 'node:fs';
import path from 'node:path';

export const EXPECTED_ASSETS = [
  { name: 'hero-valley.webp', minBytes: 50000, role: 'Hero Chapter 01 Stage Canvas' },
  { name: 'philosophy-companions.webp', minBytes: 40000, role: 'Philosophy Chapter 02 People Canvas' },
  { name: 'showcase-world.webp', minBytes: 50000, role: 'Showcase Chapter 03 World Canvas' },
  { name: 'exhibition-pantheon.webp', minBytes: 80000, role: 'Exhibition Chapter 04 Celestial Pantheon Canvas' },
  { name: 'environment-caldera.webp', minBytes: 50000, role: 'Mastery Chapter 05 Caldera Basin Canvas' },
  { name: 'environment-caldera-wide.webp', minBytes: 40000, role: 'Mastery Chapter 05 Wide Caldera Panorama' },
  { name: 'card-companions.webp', minBytes: 3000, role: 'People Chapter Companions Trilogy Card' },
  { name: 'card-scholars.webp', minBytes: 3000, role: 'People Chapter Scholars Trilogy Card' },
  { name: 'card-builders.webp', minBytes: 3000, role: 'People Chapter Builders Trilogy Card' },
  { name: 'thumb-waterfall-citadel.webp', minBytes: 8000, role: 'Showcase Chapter Waterfall Citadel Thumbnail' },
];

/**
 * Validates binary header of a WebP file
 * Format: Bytes 0-3: 'RIFF', Bytes 8-11: 'WEBP'
 */
export function validateWebPHeader(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(12);
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    const riff = buffer.toString('ascii', 0, 4);
    const webp = buffer.toString('ascii', 8, 12);

    return {
      isValid: riff === 'RIFF' && webp === 'WEBP',
      headerRiff: riff,
      headerWebp: webp,
    };
  } catch (err) {
    return {
      isValid: false,
      error: err.message,
    };
  }
}

/**
 * Scans public/assets/images and audits all expected assets
 */
export function auditAssetIntegrity(projectRoot) {
  const assetDir = path.join(projectRoot, 'public', 'assets', 'images');
  const results = [];
  let allValid = true;

  if (!fs.existsSync(assetDir)) {
    return {
      directoryExists: false,
      allValid: false,
      results: [],
      error: `Directory not found: ${assetDir}`,
    };
  }

  for (const asset of EXPECTED_ASSETS) {
    const fullPath = path.join(assetDir, asset.name);
    const exists = fs.existsSync(fullPath);

    if (!exists) {
      allValid = false;
      results.push({
        name: asset.name,
        role: asset.role,
        exists: false,
        sizeBytes: 0,
        validHeader: false,
        error: 'File does not exist',
      });
      continue;
    }

    const stats = fs.statSync(fullPath);
    const headerCheck = validateWebPHeader(fullPath);
    const meetsMinSize = stats.size >= asset.minBytes;
    const isPassing = headerCheck.isValid && meetsMinSize;

    if (!isPassing) {
      allValid = false;
    }

    results.push({
      name: asset.name,
      role: asset.role,
      exists: true,
      sizeBytes: stats.size,
      meetsMinSize,
      validHeader: headerCheck.isValid,
      isPassing,
    });
  }

  return {
    directoryExists: true,
    allValid,
    totalAssets: EXPECTED_ASSETS.length,
    passedAssets: results.filter((r) => r.isPassing).length,
    results,
  };
}
