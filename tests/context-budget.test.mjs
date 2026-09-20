import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const lines = path => readFileSync(path, "utf8").split(/\r?\n/).length;
test("cold-start documents stay within declared context budgets", () => {
  assert.ok(lines("OWNER_PLAYBOOK.md") <= 350);
  assert.ok(lines("adapters/codex/process-workflow/SKILL.md") <= 120);
  assert.match(readFileSync("GAPS.md", "utf8"), /GAPS-legacy/);
});
