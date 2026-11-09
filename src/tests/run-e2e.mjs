#!/usr/bin/env node
/**
 * run-e2e.mjs
 * Master E2E Test Suite Orchestrator for Aegyra Portfolio
 * Executes Tiers 1-4 with zero external server dependencies,
 * provides colorized terminal output, and enforces pass/fail exit gates.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const TIERS = [
  {
    id: 1,
    name: 'Tier 1: Feature Coverage (Core Design & Artifact Foundations)',
    file: 'tier1-features.test.mjs',
    expectedTests: 8,
  },
  {
    id: 2,
    name: 'Tier 2: Boundary & Corner Cases (Responsive & Environmental Rigor)',
    file: 'tier2-boundaries.test.mjs',
    expectedTests: 8,
  },
  {
    id: 3,
    name: 'Tier 3: Cross-Feature Interactions (State Machines & GSAP Dynamics)',
    file: 'tier3-interactions.test.mjs',
    expectedTests: 5,
  },
  {
    id: 4,
    name: 'Tier 4: Real-World Application Scenarios (Full Agency User Journey)',
    file: 'tier4-scenarios.test.mjs',
    expectedTests: 5,
  },
];

/**
 * Executes a single tier test file using Node's test runner
 */
function runTier(tier) {
  return new Promise((resolve) => {
    const testFilePath = path.join(__dirname, tier.file);
    const nodeBinary = process.execPath;
    const startTime = Date.now();

    const proc = spawn(nodeBinary, ['--test', testFilePath], {
      cwd: PROJECT_ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (exitCode) => {
      const durationMs = Date.now() - startTime;
      
      // Parse test counts from output
      const passMatch = stdout.match(/ℹ pass (\d+)/);
      const failMatch = stdout.match(/ℹ fail (\d+)/);
      const totalMatch = stdout.match(/ℹ tests (\d+)/);

      const passed = passMatch ? parseInt(passMatch[1], 10) : 0;
      const failed = failMatch ? parseInt(failMatch[1], 10) : 0;
      const total = totalMatch ? parseInt(totalMatch[1], 10) : (passed + failed);

      resolve({
        id: tier.id,
        name: tier.name,
        file: tier.file,
        exitCode,
        passed,
        failed,
        total,
        durationMs,
        stdout,
        stderr,
        success: exitCode === 0 && failed === 0,
      });
    });
  });
}

/**
 * Main Orchestrator
 */
async function main() {
  const args = process.argv.slice(2);
  let targetTier = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tier' && args[i + 1]) {
      targetTier = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i].startsWith('--tier=')) {
      targetTier = parseInt(args[i].split('=')[1], 10);
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node src/tests/run-e2e.mjs [options]

Options:
  --tier <number>   Execute only the specified tier (1, 2, 3, or 4)
  --help, -h        Display this help message
      `);
      process.exit(0);
    }
  }

  console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}           AEGYRA PORTFOLIO — OPAQUE-BOX E2E TEST RUNNER              ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================================${colors.reset}\n`);

  const selectedTiers = targetTier
    ? TIERS.filter((t) => t.id === targetTier)
    : TIERS;

  if (selectedTiers.length === 0) {
    console.error(`${colors.red}Error: Invalid tier ${targetTier}. Choose from 1, 2, 3, or 4.${colors.reset}`);
    process.exit(2);
  }

  const results = [];
  const suiteStartTime = Date.now();

  for (const tier of selectedTiers) {
    process.stdout.write(`  ${colors.dim}Running${colors.reset} ${colors.bold}${tier.name}${colors.reset}... `);
    const result = await runTier(tier);
    results.push(result);

    if (result.success) {
      console.log(`${colors.green}✓ PASS${colors.reset} ${colors.dim}(${result.passed}/${result.total} tests in ${result.durationMs}ms)${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset} ${colors.dim}(${result.passed} passed, ${result.failed} failed in ${result.durationMs}ms)${colors.reset}`);
      if (result.stderr) {
        console.error(`${colors.red}${result.stderr}${colors.reset}`);
      }
      // Print detailed failure traces
      const failLines = result.stdout
        .split('\n')
        .filter((line) => line.includes('✖') || line.includes('AssertionError'));
      if (failLines.length > 0) {
        console.log(`    ${colors.yellow}${failLines.join('\n    ')}${colors.reset}`);
      }
    }
  }

  const totalDuration = Date.now() - suiteStartTime;
  const totalPassed = results.reduce((acc, r) => acc + r.passed, 0);
  const totalFailed = results.reduce((acc, r) => acc + r.failed, 0);
  const totalTests = results.reduce((acc, r) => acc + r.total, 0);
  const allSuccess = results.every((r) => r.success);

  console.log(`\n${colors.bold}----------------------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}                         COVERAGE SUMMARY MATRIX                      ${colors.reset}`);
  console.log(`${colors.bold}----------------------------------------------------------------------${colors.reset}`);
  console.log(` Tier | Status | Tests | Pass Rate | Duration | Scope Description`);
  console.log(`------|--------|-------|-----------|----------|---------------------------------`);

  for (const r of results) {
    const statusStr = r.success ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
    const rate = r.total > 0 ? Math.round((r.passed / r.total) * 100) : 0;
    const tierNum = `T${r.id}  `;
    const testsStr = `${r.passed}/${r.total}`.padEnd(5);
    const rateStr = `${rate}%`.padEnd(9);
    const durationStr = `${r.durationMs}ms`.padEnd(8);
    const shortDesc = r.name.split(':')[1]?.split('(')[0]?.trim() || r.name;
    console.log(` ${tierNum}| ${statusStr}   | ${testsStr} | ${rateStr} | ${durationStr} | ${shortDesc}`);
  }

  console.log(`${colors.bold}----------------------------------------------------------------------${colors.reset}`);
  console.log(` Total: ${totalPassed}/${totalTests} tests passed (${Math.round((totalPassed / totalTests) * 100)}%) in ${totalDuration}ms`);
  console.log(`${colors.bold}----------------------------------------------------------------------${colors.reset}\n`);

  if (allSuccess) {
    console.log(`${colors.bold}${colors.green}✓ ALL E2E VERIFICATION TIERS PASSED SUCCESSFULLY! (100% Ready)${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.bold}${colors.red}✗ VERIFICATION FAILED: ${totalFailed} test(s) failed.${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Unexpected test runner error:`, err);
  process.exit(2);
});
