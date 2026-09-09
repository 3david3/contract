const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const historyPath = path.join(__dirname, 'contract-results', 'history.json');
const outputPath = path.join(root, 'docs', 'contract-history.md');

function readHistory() {
  if (!fs.existsSync(historyPath)) return [];
  try {
    const value = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function icon(status) {
  if (status === 'PASS') return '✅';
  if (status === 'FAIL') return '❌';
  if (status === 'ERROR') return '⚠️';
  return '—';
}

const history = readHistory();
const latest = history.at(-1);
const rows = history.map((r) => {
  const b = r.browsers || {};
  const c = r.contractCoverage || {};
  return `| ${r.date} | ${r.time} | ${r.tag || '@QAlocators'} | ${icon(b.chromium)} | ${icon(b.firefox)} | ${icon(b.webkit)} | ${c.percent ?? 0}% (${c.implemented ?? 0}/${c.total ?? 0}) | ${(c.missingCapabilities || []).join(', ') || 'None'} | ${r.overall || 'UNKNOWN'} |`;
}).join('\n');

let trend = 'No executions yet.';
if (history.length >= 2) {
  const first = history[0].contractCoverage?.percent ?? 0;
  const last = latest.contractCoverage?.percent ?? 0;
  const delta = last - first;
  trend = `${delta >= 0 ? '+' : ''}${delta} percentage points since the first recorded execution.`;
}

const markdown = `# Contract Execution History\n\n> Generated automatically from the Locator Contract Monitor.\n\n**Generated:** ${new Date().toISOString()}  \n**Purpose:** Give Team A (Locator QA), Team B (Automation QA), and DEV a shared view of contract health and coverage progress.\n\n## Latest Result\n\n${latest ? `- **Contract:** ${latest.contract}  \n- **Contract Version:** ${latest.contractVersion}  \n- **Tag:** ${latest.tag || '@QAlocators'}  \n- **Coverage:** ${latest.contractCoverage?.percent ?? 0}% (${latest.contractCoverage?.implemented ?? 0}/${latest.contractCoverage?.total ?? 0})  \n- **Overall:** ${latest.overall || 'UNKNOWN'}  \n- **Chromium:** ${icon(latest.browsers?.chromium)}  \n- **Firefox:** ${icon(latest.browsers?.firefox)}  \n- **WebKit:** ${icon(latest.browsers?.webkit)}  \n- **Missing capabilities:** ${(latest.contractCoverage?.missingCapabilities || []).join(', ') || 'None'}` : 'No executions recorded yet.'}\n\n## Coverage Trend\n\n${trend}\n\n## Execution History\n\n| Date | Time | Tag | Chromium | Firefox | WebKit | Contract Coverage | Missing Capabilities | Overall |\n|---|---|---|---|---|---|---:|---|---|\n${rows || '| — | — | — | — | — | — | 0% (0/0) | No executions yet | UNKNOWN |'}\n\n## Test Tags\n\n- **@QAlocators** — Team A owns locator/contract health and investigates UI behavior, locator failures, and contract regressions.\n- **@QA** — Automation QA owns business/workflow validation using the public contract API.\n- **@dev** — DEV-facing smoke/verification tests; useful when a build needs quick application-level feedback.\n\n### Useful commands\n\n\`npx playwright test --grep @QAlocators\`  \n\`npx playwright test --grep @QA\`  \n\`npx playwright test --grep @dev\`  \n\n> The Locator Contract Monitor uses **@QAlocators** so Team A sees the same contract-health behavior that the monitor records.\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, markdown, 'utf8');
console.log(`Generated ${path.relative(root, outputPath)}`);
