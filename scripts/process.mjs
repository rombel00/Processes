#!/usr/bin/env node
// Node >=22; no external packages. This verifies records, not human identity.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ADAPTER_VERSION = '0.2.3';
const BEGIN = '<!-- processes:begin -->';
const END = '<!-- processes:end -->';
const LOCK = '.process/installation.json';
const DEFAULT_DOCS = { profile: 'docs/process/PROJECT_PROFILE.md', roadmap: 'docs/process/ROADMAP.md', approvals: 'docs/process/APPROVALS.md', status: '.process/status.md' };
const TEMPLATES = { profile: 'PROJECT_PROFILE.md', roadmap: 'ROADMAP.md', approvals: 'APPROVALS.md' };
const MODULES = ['process-core', 'product-discovery', 'product-definition', 'product-design', 'delivery'];
export const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const json = data => JSON.stringify(data, null, 2) + '\n';
function need(condition, message) { if (!condition) throw new Error(message); }
function nonempty(value) { return typeof value === 'string' && value.trim().length > 0; }
function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }

// Refuse symlinks/junctions and traversal in every managed path (including reads).
export function inside(root, rel) {
  need(nonempty(rel) && !rel.includes('\\') && !rel.includes(':') && !path.isAbsolute(rel), `Unsafe relative path: ${rel}`);
  const parts = rel.split('/');
  need(parts.every(p => p && p !== '.' && p !== '..'), `Unsafe relative path: ${rel}`);
  let at = root;
  for (const p of parts) {
    at = path.join(at, p);
    if (fs.existsSync(at) || fs.lstatSync(at, { throwIfNoEntry: false })) {
      need(!fs.lstatSync(at).isSymbolicLink(), `Symlink/junction is not supported: ${rel}`);
    }
  }
  return at;
}
function projectRoot(root) {
  const absolute = path.resolve(root);
  need(fs.existsSync(absolute) && fs.statSync(absolute).isDirectory(), 'Project directory must already exist');
  need(!fs.lstatSync(absolute).isSymbolicLink(), 'Project root must not be a symlink/junction');
  return fs.realpathSync(absolute);
}
function block(text, begin = BEGIN, end = END) {
  const a = text.indexOf(begin), b = text.indexOf(end);
  if (a < 0 && b < 0) return null;
  need(a >= 0 && b > a && text.indexOf(begin, a + 1) < 0 && text.indexOf(end, b + 1) < 0, 'Malformed/duplicate Processes managed block');
  return text.slice(a, b + end.length);
}
function managedInstructions() {
  return `${BEGIN}\n## Processes — project working agreement\nBefore starting work, read .process/installation.json and use\n.process/vendor/plugins/process-core/WORKING_AGREEMENT.md as the authority.\nRead section 3 for routine work; other sections only when their topic applies.\nRead the mapped profile, active roadmap block/part/subblock, status and state in one bootstrap,\nthen only the active package/approval and dependency history when needed.\nRun \`node .process/runtime/process.mjs doctor --project .\` (Node >=22).\nIf validation fails, report the problem and stop dependent work. Never infer approval.\nIf phase is checkpoint or awaiting-package, present the current result/next proposal\nand STOP for the owner's explicit instruction; do not start work outside the package.\nUse .agents/skills/process-workflow/SKILL.md for every substantive project task.\nLocate the large roadmap block (for example MVP) and its part: thin block scope,\narchitecture/security foundation, iterative delivery, or acceptance/release.\nIn the first task message state the actual model, recommended model and reason.\nScope and foundation normally use separate tasks. One delivery task may process several\nconnected subblocks in order: detailed spec, architecture impact, delta only if needed,\nimplementation/checks and integration. Announce a new task at package DoD or context breakdown.\nDiscuss goal/DoD, approve the package, execute/check, save handoff and STOP.\nOne package approval never authorizes work outside it. Classify new ideas before changing scope.\nDo not turn simple questions into project onboarding.\nProject documents and direct owner instructions determine the approved scope.\nRead only selected methodology as needed; installation does not authorize execution.\n${END}`;
}

export function checkApproval(bytes, record, kind) {
  need(record?.schema === 1 && record.kind === kind && record.decision === 'approved', `Expected an approved ${kind} record`);
  need(nonempty(record.source) && nonempty(record.quote) && nonempty(record.date), 'Approval needs source, owner words and date');
  need(record.sha256 === sha(bytes), 'Stale approval: document digest differs');
  return true;
}

function proposalCheck(p) {
  need(p.schema === 1 && nonempty(p.goal) && nonempty(p.revision), 'Proposal needs schema=1, goal and revision');
  need(typeof p.sourceSha256 === 'string' && /^[a-f0-9]{64}$/.test(p.sourceSha256), 'Proposal must pin sourceSha256 from inspect');
  need(Array.isArray(p.modules) && p.modules.includes('process-core') && new Set(p.modules).size === p.modules.length, 'Modules must be unique and include process-core');
  for (const m of p.modules) need(MODULES.includes(m) && nonempty(p.reasons?.[m]), `Unknown module or missing reason: ${m}`);
  need(p.documents && Object.keys(p.documents).length === 4 && Object.keys(DEFAULT_DOCS).every(k => nonempty(p.documents[k])), 'Map profile, roadmap, approvals and status documents');
  const paths = Object.values(p.documents).map(v => v.toLowerCase());
  need(new Set(paths).size === 4, 'Document paths must be distinct');
  for (const rel of Object.values(p.documents)) {
    need(rel.endsWith('.md') && (rel.startsWith('docs/') || rel === '.process/status.md'), 'Documents must be Markdown under docs/ or .process/status.md');
  }
}

function walk(root, rel, out) {
  const at = inside(root, rel);
  const stat = fs.statSync(at);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(at).sort()) walk(root, `${rel}/${name}`, out);
  } else if (stat.isFile()) out[rel] = fs.readFileSync(at);
  else throw new Error(`Unsupported source: ${rel}`);
}

export function sourceFingerprint(source) {
  const root = projectRoot(source), bundle = {};
  for (const mod of MODULES) walk(root, `plugins/${mod}`, bundle);
  for (const rel of ['scripts/process.mjs', 'adapters/codex/process-workflow/SKILL.md', 'adapters/codex/README.md']) walk(root, rel, bundle);
  return sha(json(Object.fromEntries(Object.keys(bundle).sort().map(rel => [rel, sha(bundle[rel])]))));
}

export function inspect(project, source) {
  const root = projectRoot(project);
  const candidates = ['AGENTS.md', 'AGENTS.override.md', 'CLAUDE.md', LOCK, '.process/state.json', ...Object.values(DEFAULT_DOCS)];
  return { project: root, sourceSha256: source ? sourceFingerprint(source) : null, installed: fs.existsSync(inside(root, LOCK)), files: candidates.filter(p => fs.existsSync(inside(root, p))),
    next: 'Read existing context, interview only for missing facts, recommend modules using WORKING_AGREEMENT, present plan/logic/DoD/checkpoint; obtain approval before apply.' };
}

export function apply({ project, source, proposalFile, approvalFile }) {
  const root = projectRoot(project), src = projectRoot(source);
  const bytes = fs.readFileSync(proposalFile), proposal = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
  const approval = readJSON(approvalFile);
  proposalCheck(proposal); checkApproval(bytes, approval, 'connection');
  need(proposal.sourceSha256 === sourceFingerprint(src), 'Source changed since proposal; approve the actual source version before installation');
  need(!fs.existsSync(inside(root, 'AGENTS.override.md')), 'AGENTS.override.md shadows AGENTS.md; reconcile existing instructions before connecting');
  const old = fs.existsSync(inside(root, LOCK)) ? readJSON(inside(root, LOCK)) : null;
  if (old) {
    const result = doctor(root);
    need(result.ok, `Existing installation needs attention: ${result.errors.join('; ')}`);
    need(old.proposalSha256 === sha(bytes), 'Changing modules/mapping/version requires an explicit migration package; automatic replacement is disabled');
  }
  const files = {};
  const versions = {};
  for (const mod of proposal.modules) {
    const bundle = {};
    walk(src, `plugins/${mod}`, bundle);
    const manifest = JSON.parse(bundle[`plugins/${mod}/.claude-plugin/plugin.json`]);
    need(manifest.name === mod && nonempty(manifest.version), `Invalid source manifest: ${mod}`);
    versions[mod] = manifest.version;
    for (const [rel, content] of Object.entries(bundle)) files[`.process/vendor/${rel}`] = content;
  }
  files['.process/runtime/process.mjs'] = fs.readFileSync(inside(src, 'scripts/process.mjs'));
  files['.agents/skills/process-workflow/SKILL.md'] = fs.readFileSync(inside(src, 'adapters/codex/process-workflow/SKILL.md'));
  files['.process/connection.json'] = bytes;
  files['.process/connection-approval.json'] = Buffer.from(json(approval));
  const hashes = Object.fromEntries(Object.entries(files).map(([name, data]) => [name, sha(data)]));
  if (old) {
    need(old.adapterVersion === ADAPTER_VERSION && JSON.stringify(old.files) === JSON.stringify(hashes), 'Source version/content changed; use a separately approved migration');
    return { changed: false, message: 'Already connected; documents and state preserved' };
  }
  const agentsPath = inside(root, 'AGENTS.md');
  const existing = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf8') : '';
  need(block(existing) === null, 'Untracked Processes block already exists; refusing to overwrite');
  const attributesPath = inside(root, '.gitattributes');
  const existingAttributes = fs.existsSync(attributesPath) ? fs.readFileSync(attributesPath, 'utf8') : '';
  need(block(existingAttributes, '# processes:begin', '# processes:end') === null, 'Untracked Processes attributes block already exists');
  const attributes = '# processes:begin\n# Preserve exact bytes used by Processes approval/integrity hashes.\nAGENTS.md -text\n.process/vendor/** -text\n.process/runtime/** -text\n.process/connection*.json -text\n.agents/skills/process-workflow/** -text\ndocs/process/packages/** -text\n# processes:end';
  const instructions = managedInstructions();
  files['AGENTS.md'] = Buffer.from(existing + (existing && !existing.endsWith('\n') ? '\n' : '') + '\n' + instructions + '\n');
  files['.gitattributes'] = Buffer.from(existingAttributes + (existingAttributes && !existingAttributes.endsWith('\n') ? '\n' : '') + '\n' + attributes + '\n');
  const newDocs = [];
  for (const [role, rel] of Object.entries(proposal.documents)) {
    if (!fs.existsSync(inside(root, rel))) {
      files[rel] = role === 'status' ? Buffer.from('# Состояние\n\nКрупный блок / часть / подблок: не определены.\nПроцесс подключён. Пакет работы ещё не согласован. Стоп: восстановить roadmap и представить ближайшую часть владельцу.\n') : fs.readFileSync(inside(src, `plugins/process-core/templates/${TEMPLATES[role]}`));
      newDocs.push(rel);
    }
  }
  files['.process/state.json'] = Buffer.from(json({ schema: 1, phase: 'awaiting-package', package: null, approval: null }));
  const manifest = { schema: 1, adapterVersion: ADAPTER_VERSION, modules: versions, documents: proposal.documents,
    proposalSha256: sha(bytes), agentsBlockSha256: sha(instructions), attributesBlockSha256: sha(attributes), files: hashes };
  files[LOCK] = Buffer.from(json(manifest)); // Marker written last; incomplete runs fail doctor.
  const originals = { 'AGENTS.md': existing, '.gitattributes': existingAttributes };
  const present = Object.keys(originals).filter(rel => fs.existsSync(inside(root, rel)));
  // Validate ALL destinations before creating anything. Never overwrite unknown files.
  for (const rel of [...Object.keys(files), ...present.map(rel => `.process/backup-before-connection/${rel}`)]) {
    const destination = inside(root, rel);
    need(Object.hasOwn(originals, rel) || !fs.existsSync(destination), `Existing unmanaged file: ${rel}`);
  }
  const created = [], dirs = [];
  function mkdirs(dir) {
    if (fs.existsSync(dir)) return;
    mkdirs(path.dirname(dir)); fs.mkdirSync(dir); dirs.push(dir);
  }
  try {
    for (const rel of present) {
      const backup = `.process/backup-before-connection/${rel}`;
      mkdirs(path.dirname(inside(root, backup))); fs.writeFileSync(inside(root, backup), originals[rel], { flag: 'wx' }); created.push(backup);
    }
    for (const [rel, data] of Object.entries(files)) {
      const destination = inside(root, rel); mkdirs(path.dirname(destination));
      // Track originals before write, so even a partial write is restored on error.
      if (present.includes(rel)) created.push(rel);
      fs.writeFileSync(destination, data, { flag: present.includes(rel) ? 'w' : 'wx' });
      if (!present.includes(rel)) created.push(rel);
    }
  } catch (error) {
    // In-process errors restore originals. Hard interruption leaves visible partial install.
    for (const rel of created.reverse()) {
      if (present.includes(rel)) fs.writeFileSync(inside(root, rel), originals[rel]);
      else fs.unlinkSync(inside(root, rel));
    }
    for (const dir of dirs.reverse()) if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
    throw error;
  }
  return { changed: true, modules: versions, newDocuments: newDocs, next: 'Fill/reconcile project documents from actual decisions; no work package is authorized by installation' };
}

export function doctor(project) {
  const errors = [], warnings = [];
  let phase = null, modules = null;
  try {
    const root = projectRoot(project);
    const lock = readJSON(inside(root, LOCK));
    need(lock.schema === 1 && lock.adapterVersion === ADAPTER_VERSION, 'Unsupported installation/adapter version');
    need(!fs.existsSync(inside(root, 'AGENTS.override.md')), 'AGENTS.override.md shadows installed instructions');
    const bytes = fs.readFileSync(inside(root, '.process/connection.json'));
    const proposal = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
    proposalCheck(proposal);
    checkApproval(bytes, readJSON(inside(root, '.process/connection-approval.json')), 'connection');
    need(lock.proposalSha256 === sha(bytes) && JSON.stringify(lock.documents) === JSON.stringify(proposal.documents), 'Connection/manifest mismatch');
    need(lock.files && Object.keys(lock.files).length > 0, 'Missing inventory');
    for (const required of ['.process/runtime/process.mjs', '.agents/skills/process-workflow/SKILL.md', '.process/connection.json', '.process/connection-approval.json', '.process/vendor/plugins/process-core/WORKING_AGREEMENT.md', '.process/vendor/plugins/process-core/PROCESS.md']) need(lock.files[required], `Missing inventory entry: ${required}`);
    for (const [rel, digest] of Object.entries(lock.files)) {
      need(sha(fs.readFileSync(inside(root, rel))) === digest, `Modified/missing managed file: ${rel}`);
    }
    need(sha(block(fs.readFileSync(inside(root, 'AGENTS.md'), 'utf8')) || '') === lock.agentsBlockSha256, 'AGENTS.md managed block changed/missing');
    const attributes = block(fs.readFileSync(inside(root, '.gitattributes'), 'utf8').replace(/\r\n/g, '\n'), '# processes:begin', '# processes:end');
    need(sha(attributes || '') === lock.attributesBlockSha256, '.gitattributes managed block changed/missing');
    need(JSON.stringify(Object.keys(lock.modules).sort()) === JSON.stringify([...proposal.modules].sort()), 'Module inventory mismatch');
    for (const [mod, version] of Object.entries(lock.modules)) {
      const m = readJSON(inside(root, `.process/vendor/plugins/${mod}/.claude-plugin/plugin.json`));
      need(m.name === mod && m.version === version, `Module version mismatch: ${mod}`);
    }
    for (const rel of Object.values(lock.documents)) need(fs.statSync(inside(root, rel)).isFile(), `Missing project document: ${rel}`);
    const state = readJSON(inside(root, '.process/state.json'));
    need(state.schema === 1 && ['awaiting-package', 'ready', 'checkpoint'].includes(state.phase), 'Invalid project state');
    phase = state.phase; modules = lock.modules;
    if (state.phase === 'ready' || state.package || state.approval) {
      need(nonempty(state.package) && nonempty(state.approval), 'Active package and approval must both be mapped');
      need(state.package.startsWith('docs/process/packages/') && state.package.endsWith('.md'), 'Keep immutable packages under docs/process/packages/ (protected from Git newline conversion)');
      checkApproval(fs.readFileSync(inside(root, state.package)), readJSON(inside(root, state.approval)), 'package');
    }
    if (phase !== 'ready') warnings.push('STOP: owner decision required before starting the next package');
    warnings.push('Document semantics, owner identity and deployment permissions are not proven by hashes; read the source conversation and approvals.');
  } catch (error) { errors.push(error.message); }
  return { ok: errors.length === 0, phase, modules, errors, warnings };
}

// Read-only cold-start index. It reports state, never grants execution permission.
export function handoff(project) {
  const checks = doctor(project);
  if (!checks.ok) return { ...checks, next: 'blocked', documents: null };
  try {
    const root = projectRoot(project);
    const lock = readJSON(inside(root, LOCK));
    const state = readJSON(inside(root, '.process/state.json'));
    const paths = { ...lock.documents };
    if (state.package) { paths.package = state.package; paths.approval = state.approval; }
    const documents = Object.fromEntries(Object.entries(paths).map(([role, rel]) =>
      [role, { path: rel, sha256: sha(fs.readFileSync(inside(root, rel))) }]));
    return { ...checks, project: root, documents,
      next: checks.phase === 'ready' ? 'read-active-package-and-owner-approval' : 'discuss-next-node-only',
      reminder: 'Read status for node/parent, results and open questions. Parent planning approval does not authorize child execution. STOP at the active package checkpoint.' };
  } catch (error) {
    return { ...checks, ok: false, errors: [...checks.errors, error.message], next: 'blocked', documents: null };
  }
}

export function main(argv) {
  const [command, ...args] = argv, options = {};
  for (let i = 0; i < args.length; i += 2) {
    need(args[i]?.startsWith('--') && args[i + 1] && !args[i + 1].startsWith('--'), 'Options require values');
    need(!Object.hasOwn(options, args[i].slice(2)), 'Duplicate option'); options[args[i].slice(2)] = args[i + 1];
  }
  need(Number(process.versions.node.split('.')[0]) >= 22, 'Node.js >=22 is required');
  const allowed = { inspect: ['project', 'source'], doctor: ['project'], handoff: ['project'], apply: ['project', 'source', 'proposal', 'approval'], 'check-approval': ['document', 'approval', 'kind'] };
  need(allowed[command], 'Usage: process.mjs inspect|apply|doctor|handoff|check-approval (see adapters/codex/README.md)');
  for (const key of Object.keys(options)) need(allowed[command].includes(key), `Unknown option: ${key}`);
  let result;
  if (command === 'inspect') result = inspect(options.project || '.', options.source || path.dirname(path.dirname(fileURLToPath(import.meta.url))));
  if (command === 'doctor') { result = doctor(options.project || '.'); if (!result.ok) process.exitCode = 1; }
  if (command === 'handoff') { result = handoff(options.project || '.'); if (!result.ok) process.exitCode = 1; }
  if (command === 'apply') {
    need(options.proposal && options.approval, 'apply needs --proposal and --approval');
    result = apply({ project: options.project || '.', source: options.source || path.dirname(path.dirname(fileURLToPath(import.meta.url))), proposalFile: options.proposal, approvalFile: options.approval });
  }
  if (command === 'check-approval') {
    need(options.document && options.approval && ['connection', 'package'].includes(options.kind), 'Provide --document, --approval and --kind connection|package');
    result = { ok: checkApproval(fs.readFileSync(options.document), readJSON(options.approval), options.kind) };
  }
  console.log(json(result));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
