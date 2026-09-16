import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const source = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : '/bin/bash';
const run = (cwd, command) => spawnSync(bash, ['-c', command], { cwd, encoding: 'utf8', timeout: 120000 });
test('checker rejects missing tools, missing inputs, empty inventory and private key marker', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'process-check-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(temp)), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(temp).startsWith('process-check-'));
    fs.rmSync(temp, { recursive: true, force: true });
  });
  fs.mkdirSync(path.join(temp, 'scripts'));
  fs.copyFileSync(path.join(source, 'scripts/check-skills.sh'), path.join(temp, 'scripts/check-skills.sh'));
  let result = run(temp, 'PATH=/missing /bin/bash scripts/check-skills.sh');
  assert.equal(result.status, 2, result.stderr); assert.match(result.stderr, /prerequisite missing/);
  result = run(temp, 'export PATH=/usr/bin:/bin; bash scripts/check-skills.sh');
  assert.equal(result.status, 2, result.stderr); assert.match(result.stderr, /input missing/);
  for (const name of ['plugins', 'templates', '.claude-plugin', 'README.md', 'ARCHITECTURE.md', 'GAPS.md', 'INVENTORY.md', 'SOURCES.md']) fs.cpSync(path.join(source, name), path.join(temp, name), { recursive: true });
  const manifest = path.join(temp, '.claude-plugin/marketplace.json');
  const old = fs.readFileSync(manifest); fs.writeFileSync(manifest, '{"plugins":[]}');
  result = run(temp, 'export PATH=/usr/bin:/bin; bash scripts/check-skills.sh');
  assert.equal(result.status, 2, result.stderr); assert.match(result.stderr, /empty marketplace/);
  fs.writeFileSync(manifest, old);
  // Only a header, no actual private key material.
  fs.appendFileSync(path.join(temp, 'README.md'), '\n' + ['-----BEGIN', ' PRIVATE KEY-----'].join('') + '\n');
  result = run(temp, 'export PATH=/usr/bin:/bin; bash scripts/check-skills.sh');
  assert.equal(result.status, 1, result.stderr); assert.match(result.stdout, /значение скрыто/);
  assert.ok(!result.stdout.includes('BEGIN PRIVATE'));
});
