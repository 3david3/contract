const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const findings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (['node_modules', '.git', 'test-results', 'playwright-report', 'dist'].includes(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(root)) {
  if (!/\.(ts|js|json|yml|yaml|env\.example)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  if (/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)) findings.push(`Private key material found in ${rel}`);
  if (/ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}/.test(text)) findings.push(`GitHub token pattern found in ${rel}`);
  if (/xox[baprs]-[A-Za-z0-9-]{20,}/.test(text)) findings.push(`Slack token pattern found in ${rel}`);
}

const ignored = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
if (!ignored.includes('.env')) findings.push('.env is not Git-ignored');
if (!ignored.includes('playwright/.auth/')) findings.push('playwright/.auth/ is not Git-ignored');

if (findings.length) {
  console.error('Security check FAILED:');
  findings.forEach((x) => console.error(`- ${x}`));
  process.exit(1);
}
console.log('Security source scan passed.');
