import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { apply, doctor, inspect, sha, sourceFingerprint } from '../scripts/process.mjs';

const source = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const docs = { profile: 'docs/process/PROJECT_PROFILE.md', roadmap: 'docs/process/ROADMAP.md', approvals: 'docs/process/APPROVALS.md', status: '.process/status.md' };
function fixture(t, mutate = () => {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'process-test-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(root)), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('process-test-'));
    fs.rmSync(root, { recursive: true, force: true });
  });
  const project = path.join(root, 'project'); fs.mkdirSync(project);
  const p = { schema: 1, revision: 'test-r1', sourceSha256: sourceFingerprint(source), goal: 'Synthetic test only', modules: ['process-core'], reasons: { 'process-core': 'Test recovery' }, documents: { ...docs } };
  mutate(p);
  const proposalFile = path.join(root, 'proposal.json');
  fs.writeFileSync(proposalFile, JSON.stringify(p));
  const approvalFile = path.join(root, 'approval.json');
  fs.writeFileSync(approvalFile, JSON.stringify({ schema: 1, kind: 'connection', decision: 'approved', date: '2026-09-16', quote: 'Synthetic fixture approval', source: 'test fixture; not owner approval', sha256: sha(fs.readFileSync(proposalFile)) }));
  const options = { project, source, proposalFile, approvalFile };
  const write = (rel, content) => { const at = path.join(project, rel); fs.mkdirSync(path.dirname(at), { recursive: true }); fs.writeFileSync(at, content); };
  const read = rel => fs.readFileSync(path.join(project, rel), 'utf8');
  return { ...options, options, write, read };
}
test('fresh install, selected modules only, offline runtime and exact repeat', t => {
  const f = fixture(t);
  assert.equal(inspect(f.project).installed, false);
  assert.equal(apply(f.options).changed, true);
  const lock = f.read('.process/installation.json');
  assert.deepEqual(Object.keys(JSON.parse(lock).modules), ['process-core']);
  assert.equal(fs.existsSync(path.join(f.project, '.process/vendor/plugins/delivery')), false);
  assert.equal(doctor(f.project).phase, 'awaiting-package');
  assert.equal(apply(f.options).changed, false);
  assert.equal(f.read('.process/installation.json'), lock);
  const run = spawnSync(process.execPath, ['.process/runtime/process.mjs', 'doctor', '--project', '.'], { cwd: f.project, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(JSON.parse(run.stdout).ok, true);
});
test('existing instructions/docs preserved byte for byte; mapped docs and user edits survive repeat', t => {
  const f = fixture(t, p => { p.documents.profile = 'docs/legacy-profile.md'; });
  f.write('AGENTS.md', '# Existing\r\nKeep these instructions.\r\n');
  f.write('.gitattributes', '*.png binary\r\n');
  f.write('docs/legacy-profile.md', 'Existing decisions\r\n');
  apply(f.options);
  assert.equal(f.read('.process/backup-before-connection/AGENTS.md'), '# Existing\r\nKeep these instructions.\r\n');
  assert.equal(f.read('.process/backup-before-connection/.gitattributes'), '*.png binary\r\n');
  assert.ok(f.read('AGENTS.md').startsWith('# Existing\r\nKeep these instructions.\r\n'));
  f.write('AGENTS.md', f.read('AGENTS.md') + '\nAdditional owner rule.\n');
  f.write('docs/legacy-profile.md', 'Updated project decisions');
  const before = f.read('AGENTS.md');
  assert.equal(apply(f.options).changed, false);
  assert.equal(f.read('AGENTS.md'), before);
  assert.equal(f.read('docs/legacy-profile.md'), 'Updated project decisions');
});
test('reject stale/revoked connection approval before writes', t => {
  const f = fixture(t);
  fs.appendFileSync(f.proposalFile, '\n');
  assert.throws(() => apply(f.options), /Stale approval/);
  assert.deepEqual(fs.readdirSync(f.project), []);
});
test('active package resume and checkpoint; stale package approval fails closed', t => {
  const f = fixture(t); apply(f.options);
  const packet = '# P1\nApproved test work; stop after report.\n';
  f.write('docs/process/packages/P1.md', packet);
  f.write('docs/process/approvals/P1.json', JSON.stringify({ schema: 1, kind: 'package', decision: 'approved', source: 'synthetic-test', quote: 'test only', date: '2026-09-16', sha256: sha(packet) }));
  const state = { schema: 1, phase: 'ready', package: 'docs/process/packages/P1.md', approval: 'docs/process/approvals/P1.json' };
  f.write('.process/state.json', JSON.stringify(state));
  assert.equal(doctor(f.project).phase, 'ready'); assert.equal(doctor(f.project).ok, true);
  state.phase = 'checkpoint'; f.write('.process/state.json', JSON.stringify(state));
  assert.equal(doctor(f.project).ok, true); assert.match(doctor(f.project).warnings[0], /STOP/);
  assert.equal(apply(f.options).changed, false); assert.equal(doctor(f.project).phase, 'checkpoint');
  f.write('docs/process/packages/P1.md', packet + 'New scope');
  assert.equal(doctor(f.project).ok, false); assert.match(doctor(f.project).errors[0], /Stale approval/);
});
test('missing managed files, changed versions and incomplete setup are errors', t => {
  const f = fixture(t); apply(f.options);
  const at = path.join(f.project, '.process/vendor/plugins/process-core/.claude-plugin/plugin.json');
  const old = fs.readFileSync(at); fs.writeFileSync(at, '{}');
  assert.equal(doctor(f.project).ok, false);
  fs.writeFileSync(at, old); fs.unlinkSync(path.join(f.project, '.process/runtime/process.mjs'));
  assert.equal(doctor(f.project).ok, false);
  assert.throws(() => apply(f.options), /attention/);
  fs.unlinkSync(path.join(f.project, '.process/installation.json'));
  assert.equal(doctor(f.project).ok, false);
  assert.throws(() => apply(f.options), /Untracked/);
});
test('override, conflicting files and unsafe mappings fail without partial writes', t => {
  const f = fixture(t); f.write('AGENTS.override.md', 'Existing override');
  assert.throws(() => apply(f.options), /shadows/); assert.equal(fs.existsSync(path.join(f.project, '.process')), false);
  fs.unlinkSync(path.join(f.project, 'AGENTS.override.md'));
  f.write('.process/state.json', 'Existing state');
  assert.throws(() => apply(f.options), /unmanaged/); assert.equal(fs.existsSync(path.join(f.project, 'AGENTS.md')), false);
  const unsafe = fixture(t, p => { p.documents.profile = 'docs/../../escape.md'; });
  assert.throws(() => apply(unsafe.options), /Unsafe/);
  assert.deepEqual(fs.readdirSync(unsafe.project), []);
});
test('junction destinations cannot escape the project', t => {
  const f = fixture(t), external = path.join(path.dirname(f.project), 'external');
  fs.mkdirSync(external);
  fs.symlinkSync(external, path.join(f.project, '.process'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => apply(f.options), /Symlink/);
  assert.deepEqual(fs.readdirSync(external), []);
});
test('invalid CLI input and missing installation return nonzero', t => {
  const f = fixture(t);
  for (const args of [['doctor', '--project', f.project], ['inspect', '--prject', f.project], ['apply', '--project', f.project]]) {
    const run = spawnSync(process.execPath, [path.join(source, 'scripts/process.mjs'), ...args], { encoding: 'utf8' });
    assert.notEqual(run.status, 0);
  }
});
test('declined approval and changed approved module selection cannot overwrite an installation', t => {
  const f = fixture(t); apply(f.options);
  const original = f.read('.process/installation.json');
  const proposal = JSON.parse(fs.readFileSync(f.proposalFile));
  proposal.modules.push('delivery'); proposal.reasons.delivery = 'Test module change';
  fs.writeFileSync(f.proposalFile, JSON.stringify(proposal));
  const approval = JSON.parse(fs.readFileSync(f.approvalFile));
  approval.sha256 = sha(fs.readFileSync(f.proposalFile));
  approval.decision = 'declined'; fs.writeFileSync(f.approvalFile, JSON.stringify(approval));
  assert.throws(() => apply(f.options), /approved/);
  approval.decision = 'approved'; fs.writeFileSync(f.approvalFile, JSON.stringify(approval));
  assert.throws(() => apply(f.options), /migration/);
  assert.equal(f.read('.process/installation.json'), original);
});
test('write failure restores original instructions and removes created files', t => {
  const f = fixture(t); f.write('AGENTS.md', 'Keep original');
  const originalWrite = fs.writeFileSync;
  fs.writeFileSync = (at, ...args) => {
    if (String(at).endsWith(path.join('.process', 'state.json'))) throw new Error('Injected disk error');
    return originalWrite(at, ...args);
  };
  try { assert.throws(() => apply(f.options), /Injected/); } finally { fs.writeFileSync = originalWrite; }
  assert.equal(f.read('AGENTS.md'), 'Keep original');
  assert.deepEqual(fs.readdirSync(f.project), ['AGENTS.md']);
});
test('a correctly signed proposal cannot silently install a different source edition', t => {
  const f = fixture(t, p => { p.sourceSha256 = '0'.repeat(64); });
  assert.throws(() => apply(f.options), /Source changed/);
  assert.deepEqual(fs.readdirSync(f.project), []);
});
test('Git checkout with autocrlf preserves installation and immutable package hashes', t => {
  const f = fixture(t); apply(f.options);
  const packet = '# Approved package\nKeep exact bytes.\n';
  f.write('docs/process/packages/G1.md', packet);
  f.write('docs/process/approvals/G1.json', JSON.stringify({ schema: 1, kind: 'package', decision: 'approved', source: 'test', quote: 'fixture only', date: '2026-09-16', sha256: sha(packet) }));
  f.write('.process/state.json', JSON.stringify({ schema: 1, phase: 'ready', package: 'docs/process/packages/G1.md', approval: 'docs/process/approvals/G1.json' }));
  const git = process.platform === 'win32' ? 'C:/Program Files/Git/cmd/git.exe' : 'git';
  const run = (...args) => {
    const result = spawnSync(git, args, { cwd: f.project, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr); return result;
  };
  run('init', '-q'); run('config', 'core.autocrlf', 'true'); run('add', '.');
  const checkout = path.join(path.dirname(f.project), 'checkout');
  fs.mkdirSync(checkout);
  run('checkout-index', '--all', `--prefix=${checkout.replaceAll('\\', '/')}/`);
  assert.equal(doctor(checkout).ok, true, JSON.stringify(doctor(checkout)));
  assert.equal(fs.readFileSync(path.join(checkout, 'docs/process/packages/G1.md'), 'utf8'), packet);
});
