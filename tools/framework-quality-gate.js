const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];
const forbiddenCredentialPatterns = [
  /TEST_USER_PASSWORD\s*\|\|\s*['\"][^'\"]{1,}['\"]/,
  /password\s*[:=]\s*['\"][^'\"]{2,}['\"]/i,
  /ght@yahoo\.com/i,
  /666666/,
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'test-results', 'playwright-report', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(ts|js|json)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const scannerFilesToSkip = new Set([
  path.resolve(root, 'tools/framework-quality-gate.js'),
  path.resolve(root, 'tools/security-check.js'),
]);

for (const file of walk(root)) {
  if (scannerFilesToSkip.has(path.resolve(file))) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of forbiddenCredentialPatterns) {
    if (pattern.test(text)) failures.push(`Potential hard-coded credential in ${path.relative(root, file)}`);
  }
}

const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
for (const required of ['.env', 'playwright/.auth/']) {
  if (!gitignore.includes(required)) failures.push(`.gitignore must contain ${required}`);
}

if (fs.existsSync(path.join(root, 'playwright/.auth/user.json'))) {
  failures.push('playwright/.auth/user.json must not exist in the source workspace during a quality check.');
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const script of ['test:ci', 'test:smoke', 'test:contracts', 'test:matrix', 'report:flake', 'data:audit', 'env:check', 'quality:gate']) {
  if (!pkg.scripts?.[script]) failures.push(`package.json is missing script: ${script}`);
}

if (failures.length) {
  console.error('Framework quality gate FAILED:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Framework quality gate passed.');
console.log('✓ No known hard-coded credentials detected');
console.log('✓ Authentication artifacts are Git-ignored');
console.log('✓ Required quality scripts are present');
