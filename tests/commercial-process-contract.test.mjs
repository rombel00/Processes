import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("owner playbook covers routes and decision boundary", () => {
  const text = readFileSync("OWNER_PLAYBOOK.md", "utf8");
  for (const route of ["commercial_hypothesis", "business_request", "existing_product_change", "personal_utility"]) {
    assert.match(text, new RegExp(route));
  }
  assert.match(text, /commercial-decision/);
  assert.match(text, /отдельного пакета delivery/);
});

test("security reference and current limitations are available", () => {
  assert.ok(existsSync("plugins/delivery/references/security-and-handoff.md"));
  assert.ok(existsSync("CURRENT_LIMITATIONS.md"));
  assert.match(readFileSync("GAPS.md", "utf8"), /GAPS-legacy/);
});
