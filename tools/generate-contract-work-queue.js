const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const workflowDir = path.join(root, 'workflow');
const output = path.join(root, 'docs', 'contract-work-queue.md');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(workflowDir, file), 'utf8'));
}
function esc(value) {
  return String(value ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}
function fmtDate(value) {
  return value ? new Date(value).toLocaleString('en-US', { timeZone: 'America/New_York' }) : '—';
}
function icon(status) {
  return ({ 'COMPLETED': '🟢', 'VALIDATING': '🔵', 'IN PROGRESS': '🟡', 'ACKNOWLEDGED': '🟣', 'NEW': '⚪', 'READY': '🟡', 'SOLID / VERIFIED': '🟢', 'AT RISK': '🟠', 'BLOCKED': '🔴' })[status] || '⚪';
}

const requests = readJson('contract-requests.json').requests || [];
const dependencies = readJson('dependencies.json').dependencies || [];
const schedule = readJson('release-schedule.json');
const historyPath = path.join(root, 'monitor', 'contract-results', 'history.json');
let history = [];
if (fs.existsSync(historyPath)) { try { history = JSON.parse(fs.readFileSync(historyPath, 'utf8')); } catch {} }
const latest = history.at(-1) || null;
const generated = new Date().toISOString();
const now = new Date();
const nextBuild = new Date(schedule.nextBuild.plannedAt);
const hoursToBuild = Math.round(((nextBuild - now) / 36e5) * 10) / 10;
const blockedCount = dependencies.filter(d => d.status === 'BLOCKED').length;
const atRiskCount = dependencies.filter(d => d.status === 'AT RISK').length;
let releaseRisk = 'LOW';
if (blockedCount || atRiskCount) releaseRisk = hoursToBuild <= 4 ? 'CRITICAL' : hoursToBuild <= 24 ? 'HIGH' : 'MEDIUM';
if (latest && latest.overall === 'RED') releaseRisk = hoursToBuild <= 4 ? 'CRITICAL' : hoursToBuild <= 24 ? 'HIGH' : 'MEDIUM';

const requestRows = requests.map(r => `| ${esc(r.requestId)} | ${esc(r.contract)} | ${esc(r.contractVersion)} | ${esc(r.request)} | ${esc(r.priority)} | ${esc(r.requestedBy)} | ${esc(r.owner)} | ${fmtDate(r.requiredBy)} | ${icon(r.status)} ${esc(r.status)} |`).join('\n');
const depRows = dependencies.map(d => `| ${esc(d.dependencyId)} | ${icon(d.status)} ${esc(d.status)} | ${esc(d.waitingTeam)} | ${esc(d.waitingFor)} | ${esc(d.dependency)} | ${fmtDate(d.waitingSince)} | ${fmtDate(d.requiredBy)} | ${esc(d.dependencyOwner)} | ${esc(d.impact)} |`).join('\n');

const requestDetails = requests.map(r => {
  const history = (r.statusHistory || []).map(h => `- ${fmtDate(h.at)} — **${h.status}** — ${esc(h.by)}${h.note ? ` — ${esc(h.note)}` : ''}`).join('\n') || '- No status history';
  const criteria = (r.acceptanceCriteria || []).map(x => `- ${x}`).join('\n') || '- None defined';
  return `## ${esc(r.requestId)} — ${esc(r.request)}\n\n- **Contract:** ${esc(r.contract)}\n- **Contract Version:** ${esc(r.contractVersion)}\n- **Requested against:** ${esc(r.requestedAgainstVersion)}\n- **Implemented in:** ${esc(r.implementedInVersion)}\n- **Requested by:** ${esc(r.requestedBy)}\n- **Owner:** ${esc(r.owner)}\n- **Priority:** ${esc(r.priority)}\n- **Created:** ${fmtDate(r.created)}\n- **Updated:** ${fmtDate(r.updated)}\n- **Required by:** ${fmtDate(r.requiredBy)}\n- **Status:** ${icon(r.status)} ${esc(r.status)}\n- **Dependency:** ${esc(r.dependency)}\n- **Waiting team:** ${esc(r.waitingTeam)}\n- **Waiting for:** ${esc(r.waitingFor)}\n- **Waiting since:** ${fmtDate(r.waitingSince)}\n- **Dependency owner:** ${esc(r.dependencyOwner)}\n- **Impact:** ${esc(r.impact)}\n- **Validation:** ${esc(r.validation)}\n- **Completed:** ${fmtDate(r.completed)}\n\n### Acceptance criteria\n\n${criteria}\n\n### Status history\n\n${history}`;
}).join('\n\n');

const markdown = `# Contract Work Queue\n\n> Generated automatically. The JSON files under the workflow directory are the source of truth for requests, dependencies, and release schedule.\n\n**Generated:** ${generated}\n**Sprint:** ${esc(schedule.currentSprint)}\n**Next build:** ${esc(schedule.nextBuild.build)} — ${fmtDate(schedule.nextBuild.plannedAt)} — approximately ${hoursToBuild} hours from generation.\n**Planned release:** ${esc(schedule.plannedRelease.version)} — ${fmtDate(schedule.plannedRelease.plannedAt)}\n\n## Contract Requests\n\n| Request ID | Contract | Version | Request | Priority | Requested By | Owner | Required By | Status |\n|---|---|---|---|---|---|---|---|---|\n${requestRows || '| — | — | — | — | — | — | — | — | — |'}\n\n## Dependencies\n\n| ID | Status | Waiting Team | Waiting For | Dependency | Waiting Since | Required By | Dependency Owner | Impact |\n|---|---|---|---|---|---|---|---|---|\n${depRows || '| — | — | — | — | — | — | — | — | — |'}\n\n## Release Readiness\n\n- **Next build:** ${esc(schedule.nextBuild.build)}\n- **Build owner:** ${esc(schedule.nextBuild.owner)}\n- **Planned build time:** ${fmtDate(schedule.nextBuild.plannedAt)}\n- **Time to next build:** ${hoursToBuild} hours\n- **Planned release:** ${esc(schedule.plannedRelease.version)}\n- **Release time:** ${fmtDate(schedule.plannedRelease.plannedAt)}\n- **Blocked dependencies:** ${dependencies.filter(d => d.status === 'BLOCKED').length}\n- **At-risk dependencies:** ${atRiskCount}
- **Latest contract health:** ${latest ? `${latest.overall} — ${latest.contractCoverage?.percent ?? 0}% coverage` : 'No monitor execution recorded'}
- **Release risk:** ${releaseRisk}\n\n${requestDetails}\n\n## Team Operating Model\n\n> **Team A owns the automation contract. Team B consumes the automation contract. DEV owns how the application is built.**\n\n- Team A owns how the UI is found and validated.\n- Team B owns what business behavior to automate.\n- DEV provides the application build and stable automation hooks when required.\n- Every dependency has an owner, waiting team, required-by date, and impact.\n- SOLID / VERIFIED means the dependency has actually been received and validated; it is not merely expected.\n`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, markdown, 'utf8');
console.log(`Generated ${path.relative(root, output)}`);
