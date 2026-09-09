const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const historyDir = path.join(__dirname, 'contract-results');
const historyPath = path.join(historyDir, 'history.json');
const metadataPath = path.join(
  root,
  'packages',
  'ui-locator-contract',
  'src',
  'metadata',
  'notes.metadata.ts'
);
const contractTest = path.join(
  root,
  'tests',
  'contract',
  'note-locator.contract.spec.ts'
);

const intervalMinutes = Number(process.env.CONTRACT_MONITOR_INTERVAL_MINUTES || 5);
const runOnce = process.argv.includes('--once');

function loadMetadata() {
  const source = fs.readFileSync(metadataPath, 'utf8');
  const match = source.match(/capabilities\s*:\s*\[([\s\S]*?)\]\s*,\s*\}\s*as const/);
  if (!match) throw new Error(`Could not read capabilities from ${metadataPath}`);

  const names = [...match[1].matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1]);
  const implemented = [...match[1].matchAll(/name:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'/g)]
    .filter((m) => m[2] === 'implemented')
    .map((m) => m[1]);

  return {
    name: (source.match(/name:\s*'([^']+)'/) || [])[1] || 'Unknown',
    contractVersion: (source.match(/contractVersion:\s*'([^']+)'/) || [])[1] || 'Unknown',
    capabilities: names,
    implemented,
  };
}

function runPlaywright() {
  return new Promise((resolve) => {
    const args = [
      'playwright',
      'test',
      contractTest,
      '--project=chromium',
      '--project=firefox',
      '--project=webkit',
      '--grep',
      process.env.CONTRACT_MONITOR_GREP || '@QAlocators',
      '--reporter=json',
    ];

    const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
      cwd: root,
      env: process.env,
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });

    child.on('close', (code) => {
      let report = null;
      try {
        report = JSON.parse(stdout);
      } catch {
        // JSON reporter output may be unavailable when Playwright cannot start.
      }
      resolve({ code: code ?? 1, report, stdout, stderr });
    });
  });
}

function browserStatuses(report) {
  const statuses = { chromium: 'ERROR', firefox: 'ERROR', webkit: 'ERROR' };
  const projectResults = { chromium: [], firefox: [], webkit: [] };

  function visitSuite(suite) {
    if (!suite) return;
    if (suite.projectName && projectResults[suite.projectName]) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          for (const result of test.results || []) {
            projectResults[suite.projectName].push(result.status);
          }
        }
      }
    }
    for (const child of suite.suites || []) visitSuite(child);
  }

  for (const suite of report?.suites || []) visitSuite(suite);

  for (const browser of Object.keys(statuses)) {
    const results = projectResults[browser];
    if (!results.length) continue;
    statuses[browser] = results.every((s) => s === 'passed') ? 'PASS' : 'FAIL';
  }

  return statuses;
}

function readHistory() {
  if (!fs.existsSync(historyPath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function runContractCheck() {
  const metadata = loadMetadata();
  const total = metadata.capabilities.length;
  const implemented = metadata.implemented.length;
  const missing = metadata.capabilities.filter((name) => !metadata.implemented.includes(name));
  const coverage = total === 0 ? 0 : Math.round((implemented / total) * 100);

  const startedAt = new Date();
  const result = await runPlaywright();
  const browsers = browserStatuses(result.report);
  const browserHealthy = Object.values(browsers).every((status) => status === 'PASS');
  const overall = coverage === 100 && browserHealthy ? 'GREEN' : coverage < 100 ? 'AMBER' : 'RED';

  const record = {
    tag: process.env.CONTRACT_MONITOR_GREP || '@QAlocators',
    timestamp: startedAt.toISOString(),
    date: startedAt.toLocaleDateString('en-US', { timeZone: 'UTC' }),
    time: startedAt.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }),
    contract: metadata.name,
    contractVersion: metadata.contractVersion,
    browsers,
    contractCoverage: {
      implemented,
      total,
      percent: coverage,
      missingCapabilities: missing,
    },
    overall,
    testExitCode: result.code,
  };

  const history = readHistory();
  history.push(record);
  fs.mkdirSync(historyDir, { recursive: true });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n');

  console.log(`\n[${record.timestamp}] ${metadata.name} contract`);
  console.log(`Coverage: ${implemented}/${total} (${coverage}%)`);
  console.log(`Chromium: ${browsers.chromium}`);
  console.log(`Firefox:  ${browsers.firefox}`);
  console.log(`WebKit:   ${browsers.webkit}`);
  console.log(`Remaining: ${missing.length ? missing.join(', ') : 'none'}`);
  console.log(`Overall: ${overall}`);

  // Keep the human-readable history report synchronized with every monitor run.
  const reportScript = path.join(__dirname, 'contract-report.js');
  const reportResult = await new Promise((resolve) => {
    const child = spawn(process.platform === 'win32' ? 'node.exe' : 'node', [reportScript], { cwd: root, env: process.env });
    child.on('close', (code) => resolve(code ?? 1));
  });
  if (reportResult !== 0) console.error('Could not generate contract-history.md');

  if (result.code !== 0 && result.stderr) {
    console.error(result.stderr.trim());
  }

  return record;
}

async function main() {
  do {
    await runContractCheck();
    if (!runOnce) {
      console.log(`Next contract check in ${intervalMinutes} minute(s). Press Ctrl+C to stop.`);
      await new Promise((resolve) => setTimeout(resolve, intervalMinutes * 60 * 1000));
    }
  } while (!runOnce);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
