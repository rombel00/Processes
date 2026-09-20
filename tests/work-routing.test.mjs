import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

test('routing keeps raw commercial ideas out of build and preserves non-commercial routes', () => {
  const orchestrate = read('plugins/process-core/skills/orchestrate/SKILL.md');
  const brief = read('plugins/product-definition/skills/brief-writing/SKILL.md');
  const canvas = read('plugins/product-definition/skills/lean-canvas/SKILL.md');
  const process = read('plugins/process-core/PROCESS.md');
  assert.match(orchestrate, /commercial hypothesis не создавай build roadmap/);
  assert.match(orchestrate, /business\/personal не создавай market\/sales artifacts/);
  assert.match(brief, /не\s+разрешает architecture или implementation/);
  assert.match(canvas, /не build gate/);
  assert.match(process, /commercial_hypothesis/);
  assert.match(process, /personal_utility/);
});

test('synthetic persona critique cannot be confused with field evidence', () => {
  const critique = read('plugins/product-discovery/skills/persona-interview/SKILL.md');
  const personas = read('plugins/product-discovery/skills/persona-generation/SKILL.md');
  const registry = read('plugins/process-core/PROCESS.md');
  assert.match(critique, /synthetic_customer_critique/);
  assert.match(critique, /не market evidence/);
  assert.match(critique, /не используй для willingness to pay/);
  assert.match(personas, /synthetic composites/);
  assert.match(registry, /synthetic_customer_critique/);
});
