import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

test('process routes thin scope and subblocks through the canonical impact matrix', () => {
  const process = read('plugins/process-core/PROCESS.md');
  const agreement = read('plugins/process-core/WORKING_AGREEMENT.md');
  assert.match(process, /тонкий scope/);
  assert.match(process, /ФУНДАМЕНТ АРХИТЕКТУРЫ\/БЕЗОПАСНОСТИ/);
  assert.match(process, /для каждого подблока:/);
  assert.match(process, /architecture-advisor \(read-only\)/);
  assert.match(process, /После принятого thin scope A\/B агент сначала выполняет architecture impact/);
  assert.match(process, /та же матрица\s+WORKING_AGREEMENT §3/);
  assert.match(agreement, /`foundation_not_required`/);
  assert.match(agreement, /`foundation_required`/);
  assert.match(agreement, /`covered_by_foundation`/);
  assert.match(agreement, /только\s+`delta_required`/i);
});

test('project entry announces actual and recommended model with reason', () => {
  for (const rel of [
    'adapters/codex/process-entry/SKILL.md',
    'adapters/codex/process-workflow/SKILL.md',
    'plugins/process-core/WORKING_AGREEMENT.md',
  ]) {
    const text = read(rel);
    assert.match(text, /фактическ\S* модел/iu, rel);
    assert.match(text, /рекомендуем\S* модел/iu, rel);
    assert.match(text, /причин/iu, rel);
  }
});

test('model routing makes Terra the normal bounded executor and escalates forks', () => {
  const workflow = read('adapters/codex/process-workflow/SKILL.md');
  assert.match(workflow, /Terra — исполнение по принятой подробной/);
  assert.match(workflow, /Sol — постановка, декомпозиция/);
  assert.match(workflow, /Astra — сложная/);
  assert.match(workflow, /Terra[\s\S]*эскалирует/);
});

test('architecture advisor is trigger-only and cannot design the delta', () => {
  const advisor = read('plugins/delivery/agents/architecture-advisor.md');
  assert.match(advisor, /Только если/);
  assert.match(advisor, /не\s+проектируешь решение/);
  assert.match(advisor, /covered_by_foundation/);
  assert.match(advisor, /delta_required/);
  assert.match(advisor, /blocked/);
  assert.match(advisor, /"assessment": "architecture-advisor"/);
  const handoff = read('plugins/delivery/agents/handoff-reviewer.md');
  assert.match(handoff, /Сам триггер или вопрос не требует\s+дельты/);
  assert.match(handoff, /или конкретному вопросу/);
});

test('foundation stays thin while current delta is exact', () => {
  const checklist = read('plugins/delivery/skills/architecture-design/references/checklist.md');
  assert.match(checklist, /В фундаменте по thin scope/);
  assert.match(checklist, /Не требуй всех полей и индексов/);
  assert.match(checklist, /В адресной дельте по подробному C/);
});

test('a product-only route can iterate C without technical delivery', () => {
  const mapping = read('plugins/product-definition/skills/user-story-mapping/SKILL.md');
  assert.match(mapping, /Если результат — только спецификация\/дизайн без delivery/);
  assert.match(mapping, /фундамент, impact и код там не требуются/);
});

test('delivery package pins inputs and records authorized derived results later', () => {
  const agreement = read('plugins/process-core/WORKING_AGREEMENT.md');
  const prep = read('plugins/delivery/skills/epic-prep/SKILL.md');
  assert.match(agreement, /заранее разрешённые классы производных результатов/);
  assert.match(prep, /переподписывать неизменяемый пакет не нужно/);
});

test('development uses one whole-subblock code review without automatic rerun', () => {
  const process = read('plugins/process-core/PROCESS.md');
  const implementation = read('plugins/delivery/skills/implementation/SKILL.md');
  const agent = read('plugins/delivery/agents/implementation.md');
  const reviewer = read('plugins/delivery/agents/code-reviewer.md');
  const repair = read('plugins/delivery/skills/implementation-repair/SKILL.md');

  assert.match(process, /ровно один\s+раз на один разрешённый implementation-проход подблока/);
  assert.match(process, /`code-review` \(на финальный кандидат разрешённого implementation-прохода подблока\) \| 1/);
  assert.match(implementation, /Второй независимый\s+code-reviewer не запускается/);
  assert.match(agent, /верни один\s+`ready_for_review`/);
  assert.match(reviewer, /один шанс проверить готовый совокупный кандидат/);
  assert.match(repair, /не запрашиваешь повторное\s+независимое ревью/);
  assert.match(reviewer, /code_review_<candidate-id>\.md/);
  assert.match(agent, /отдельно разрешённого повторного\s+открытия/);
  assert.match(implementation, /сбрось\s+актуальный review-статус в `не начат`/);

  for (const [rel, text] of [
    ['process', process],
    ['implementation agent', agent],
    ['reviewer', reviewer],
    ['repair', repair],
  ]) {
    assert.doesNotMatch(text, /2 (?:ревью|цикла).*code-review|code-review.*2 (?:ревью|цикла)/iu, rel);
    assert.doesNotMatch(text, /повторн\S* `?code-reviewer`/iu, rel);
  }
});
