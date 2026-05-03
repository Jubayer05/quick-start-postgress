#!/usr/bin/env node
/**
 * After `git clone … my-app` and `pnpm install`, renames the app from the
 * clone folder (or --name). Skips if already bootstrapped (unless --force).
 * Set SKIP_BOOTSTRAP=1 to opt out (e.g. when developing the template).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  TEMPLATE_PLACEHOLDER_NAME,
  isUnbootstrappedTemplate,
  patchLayoutMetadata,
  patchRootPackageJson,
  toKebab,
  toTitle,
} from "./lib/project-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

function usage() {
  console.error(`Usage: node scripts/bootstrap.mjs [--name <name>] [--force]

  --name   package name (default: current folder name)
  --force  re-apply name even if not "${TEMPLATE_PLACEHOLDER_NAME}"`);
  process.exit(1);
}

function main() {
  if (process.env.SKIP_BOOTSTRAP === "1" || process.env.SKIP_BOOTSTRAP === "true")
    return;
  if (process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true") return;

  const args = process.argv.slice(2);
  let nameArg;
  let force = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--help" || args[i] === "-h") usage();
    if (args[i] === "--force") {
      force = true;
      continue;
    }
    if (args[i] === "--name" && args[i + 1]) {
      nameArg = args[++i];
      continue;
    }
    if (args[i].startsWith("-")) usage();
  }

  if (!fs.existsSync(path.join(PROJECT_ROOT, "package.json"))) {
    console.error("bootstrap: no package.json at project root; skipped.");
    process.exit(0);
  }

  if (!force && !isUnbootstrappedTemplate(PROJECT_ROOT)) {
    return;
  }

  const raw = nameArg ?? path.basename(PROJECT_ROOT);
  const kebab = toKebab(raw);
  if (!kebab) {
    console.error("bootstrap: could not derive a valid name; set --name.");
    process.exit(1);
  }

  patchRootPackageJson(PROJECT_ROOT, kebab);
  patchLayoutMetadata(PROJECT_ROOT, toTitle(kebab));
  console.error(`bootstrap: set project name to "${kebab}" (from folder or --name).`);
}

main();
