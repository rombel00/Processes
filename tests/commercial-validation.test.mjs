import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

test('commercial validation registers complete plugin, templates and contract skills', () => {
  const manifest = JSON.parse(read('plugins/commercial-validation/.claude-plugin/plugin.json'));
  const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'));
  assert.equal(manifest.name, 'commercial-validation');
  assert.ok(marketplace.plugins.some(plugin => plugin.name === manifest.name));

  for (const name of ['HYPOTHESIS.md', 'EVIDENCE.md', 'EXPERIMENTS.md', 'OFFER.md', 'COMMERCIAL_DECISION.md']) {
    assert.ok(fs.existsSync(path.join(root, 'plugins/commercial-validation/templates', name)), name);
  }
  for (const name of ['hypothesis-framing', 'field-discovery', 'experiment-design', 'offer-and-sales', 'commercial-decision']) {
    assert.ok(fs.existsSync(path.join(root, 'plugins/commercial-validation/skills', name, 'SKILL.md')), name);
  }
});

test('commercial contracts keep synthetic evidence, preregistration and external actions bounded', () => {
  const agreement = read('plugins/process-core/WORKING_AGREEMENT.md');
  const field = read('plugins/commercial-validation/skills/field-discovery/SKILL.md');
  const experiment = read('plugins/commercial-validation/skills/experiment-design/SKILL.md');
  const decision = read('plugins/commercial-validation/skills/commercial-decision/SKILL.md');
  const reviewer = read('plugins/commercial-validation/agents/evidence-reviewer.md');

  assert.match(agreement, /AI-generated material/);
  assert.match(field, /PII.*Git|Git.*PII/s);
  assert.match(experiment, /threshold_changed/);
  assert.match(experiment, /точный допуск/);
  assert.match(decision, /не переписывай threshold/);
  assert.match(decision, /отдельный delivery package/);
  assert.match(reviewer, /не смешаны|не смешаны/);
  assert.match(reviewer, /review_file/);
});
