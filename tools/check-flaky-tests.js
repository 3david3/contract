const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve(process.argv[2] || 'test-results/results.json');
if (!fs.existsSync(file)) {
  console.log(`[flake-check] No JSON report found at ${file}; nothing to analyze.`);
  process.exit(0);
}
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const flaky = [];
function walk(suite) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      if ((test.results || []).length > 1) flaky.push({ title: spec.title, project: test.projectName, attempts: test.results.length, status: test.status });
    }
  }
  for (const child of suite.suites || []) walk(child);
}
for (const suite of report.suites || []) walk(suite);
console.log(`[flake-check] Retried tests: ${flaky.length}`);
for (const item of flaky) console.log(` - ${item.project}: ${item.title} (${item.attempts} attempts, final=${item.status})`);
process.exit(0);
