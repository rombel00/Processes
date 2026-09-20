import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";

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
const scanRoots = ["docs", "plugins", "tests", "OWNER_PLAYBOOK.md"];
const banned = [/[A-Z0-9._%+-]+@(gmail|yandex|outlook)\.com/i, /(?:AKIA|ghp_)[A-Za-z0-9_]{12,}/];
const scan = path => {
  const stat = statSync(path);
  if (stat.isDirectory()) return readdirSync(path).flatMap(name => scan(`${path}/${name}`));
  if (!/\.(md|mjs|json)$/i.test(path)) return [];
  const text = readFileSync(path, "utf8");
  return banned.flatMap(pattern => pattern.test(text) ? [`PII-like or secret-like value in ${path}`] : []);
};
for (const finding of scanRoots.flatMap(scan)) {
  console.error(finding);
  failed = true;
}
if (failed) process.exit(1);
console.log("repository contracts: ok");
