import { existsSync, readFileSync } from "node:fs";

const marketplace = JSON.parse(readFileSync(".claude-plugin/marketplace.json", "utf8"));
let failed = false;
for (const plugin of marketplace.plugins) {
  const manifest = `${plugin.source}/.claude-plugin/plugin.json`;
  if (!existsSync(manifest)) {
    console.error(`Missing manifest for ${plugin.name}: ${manifest}`);
    failed = true;
    continue;
  }
  const parsed = JSON.parse(readFileSync(manifest, "utf8"));
  if (parsed.name !== plugin.name) {
    console.error(`Manifest name mismatch: ${plugin.name}`);
    failed = true;
  }
}

const trackedText = ["OWNER_PLAYBOOK.md", "CURRENT_LIMITATIONS.md"];
for (const file of trackedText) {
  if (!existsSync(file)) {
    console.error(`Missing required repository document: ${file}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log("repository contracts: ok");
