/**
 * build-verifier.mjs
 * Inspects production build artifacts in dist/ and executes clean build verification
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

/**
 * Inspects existing dist/ artifacts
 */
export function inspectBuildArtifacts(projectRoot) {
  const distDir = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distDir)) {
    return {
      distExists: false,
      isValid: false,
      error: 'dist/ directory does not exist. Run npm run build first.',
    };
  }

  const indexPath = path.join(distDir, 'index.html');
  const indexExists = fs.existsSync(indexPath);
  const indexContent = indexExists ? fs.readFileSync(indexPath, 'utf8') : '';
  const indexSize = indexExists ? fs.statSync(indexPath).size : 0;

  const assetsDir = path.join(distDir, 'assets');
  const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

  const cssFiles = assetFiles.filter((f) => f.endsWith('.css'));
  const jsFiles = assetFiles.filter((f) => f.endsWith('.js'));

  const cssStats = cssFiles.map((f) => {
    const p = path.join(assetsDir, f);
    return { name: f, size: fs.statSync(p).size };
  });

  const jsStats = jsFiles.map((f) => {
    const p = path.join(assetsDir, f);
    return { name: f, size: fs.statSync(p).size };
  });

  const hasNonEmptyHtml = indexSize > 500 && indexContent.includes('id="root"');
  const hasNonEmptyCss = cssStats.length > 0 && cssStats.every((s) => s.size > 1000);
  const hasNonEmptyJs = jsStats.length > 0 && jsStats.every((s) => s.size > 10000);

  const isValid = hasNonEmptyHtml && hasNonEmptyCss && hasNonEmptyJs;

  return {
    distExists: true,
    isValid,
    indexHtml: {
      exists: indexExists,
      size: indexSize,
      hasRootContainer: indexContent.includes('id="root"'),
    },
    cssFiles: cssStats,
    jsFiles: jsStats,
  };
}

/**
 * Runs a clean build via npm run build
 */
export function runCleanBuild(projectRoot) {
  const envPath = '/usr/local/nvm/versions/node/v26.13.0/bin:' + (process.env.PATH || '');
  try {
    const startTime = Date.now();
    const stdout = execSync('npm run build', {
      cwd: projectRoot,
      env: { ...process.env, PATH: envPath },
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000,
    });
    const durationMs = Date.now() - startTime;
    const artifacts = inspectBuildArtifacts(projectRoot);

    return {
      success: true,
      exitCode: 0,
      durationMs,
      stdout,
      artifacts,
    };
  } catch (err) {
    return {
      success: false,
      exitCode: err.status || 1,
      stderr: err.stderr ? err.stderr.toString() : err.message,
      stdout: err.stdout ? err.stdout.toString() : '',
    };
  }
}
