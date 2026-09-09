const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const forbidden = ['.env', 'playwright/.auth/user.json'];
const generated = ['node_modules', 'playwright-report', 'test-results'];
const violations = [...forbidden, ...generated].filter((item) => fs.existsSync(path.join(root, item)));
if (violations.length) {
  console.error('[data-audit] Remove local-only files before packaging:', violations.join(', '));
  process.exit(1);
}
console.log('[data-audit] Package hygiene passed.');
