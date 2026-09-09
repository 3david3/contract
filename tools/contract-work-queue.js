const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const file = path.join(root, 'workflow', 'contract-requests.json');

function load() { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function save(data) { fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n'); }
function arg(name) {
  const prefix = `--${name}=`;
  const value = process.argv.find(x => x.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}
function required(name) {
  const value = arg(name);
  if (!value) throw new Error(`Missing --${name}=...`);
  return value;
}
function now() { return new Date().toISOString(); }
function usage() {
  console.log(`Contract Work Queue CLI\n\nCreate:\n  node tools/contract-work-queue.js create --request="Add archiveNote()" --contract=Notes --version=1.256 --requested-by="Team B" --owner="Team A - Locator QA" --priority=P1 --required-by="2026-09-10T15:00:00-04:00" --dependency="Build 1234"\n\nUpdate status:\n  node tools/contract-work-queue.js status --id=CR-0001 --status="IN PROGRESS" --by="Team A - Locator QA" --note="Locator implementation started"\n\nComplete:\n  node tools/contract-work-queue.js status --id=CR-0001 --status=COMPLETED --by="Team A - Locator QA" --note="Validated in all browsers"`);
}

const command = process.argv[2];
if (!command || command === 'help' || command === '--help') { usage(); process.exit(0); }
const data = load();

action: {
  if (command === 'create') {
    const timestamp = now();
    const requests = data.requests || [];
    const numeric = requests.map(r => Number(String(r.requestId || '').replace('CR-', ''))).filter(Number.isFinite);
    const next = (numeric.length ? Math.max(...numeric) : 0) + 1;
    const id = `CR-${String(next).padStart(4, '0')}`;
    const request = {
      requestId: id,
      contract: required('contract'),
      contractVersion: required('version'),
      request: required('request'),
      requestedBy: required('requested-by'),
      neededFor: arg('needed-for') || 'Automation',
      priority: required('priority'),
      created: timestamp,
      updated: timestamp,
      requiredBy: required('required-by'),
      status: 'NEW',
      dependency: arg('dependency'),
      owner: arg('owner') || null,
      requestedAgainstVersion: required('version'),
      implementedInVersion: null,
      validation: null,
      completed: null,
      statusHistory: [{ status: 'NEW', at: timestamp, by: required('requested-by') }]
    };
    requests.push(request);
    data.requests = requests;
    save(data);
    console.log(`Created ${id}`);
    break action;
  }

  if (command === 'status') {
    const id = required('id');
    const status = required('status');
    const by = required('by');
    const request = (data.requests || []).find(r => r.requestId === id);
    if (!request) throw new Error(`Request ${id} not found`);
    const timestamp = now();
    request.status = status;
    request.updated = timestamp;
    request.statusHistory = request.statusHistory || [];
    request.statusHistory.push({ status, at: timestamp, by, ...(arg('note') ? { note: arg('note') } : {}) });
    if (status === 'COMPLETED') request.completed = timestamp;
    save(data);
    console.log(`Updated ${id} -> ${status}`);
    break action;
  }

  throw new Error(`Unknown command: ${command}`);
}
