#!/usr/bin/env node
/**
 * Copy template into a new folder (optional; prefer: git clone my-app && pnpm install).
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  patchLayoutMetadata,
  patchRootPackageJson,
  toKebab,
  toTitle,
} from "./lib/project-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = path.resolve(__dirname, "..");

const IGNORE_NAMES = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".turbo",
  "coverage",
]);

function usage() {
  console.error(`Usage: node scripts/create-project.mjs <project-name> [destination] [--git]`);
  process.exit(1);
}

function shouldSkipEntry(name, relPosix) {
  if (IGNORE_NAMES.has(name)) return true;
  if (relPosix === "scripts" || relPosix.startsWith("scripts/")) return true;
  return false;
}

function copyTree(srcDir, destDir, relBase = "") {
  fs.mkdirSync(destDir, { recursive: true });
  for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const rel = relBase ? `${relBase}/${ent.name}` : ent.name;
    const relPosix = rel.split(path.sep).join("/");
    if (shouldSkipEntry(ent.name, relPosix)) continue;
    if (
      ent.isFile() &&
      (ent.name === ".env" || ent.name === ".env.local")
    ) {
      continue;
    }
    const from = path.join(srcDir, ent.name);
    const to = path.join(destDir, ent.name);
    if (ent.isDirectory()) copyTree(from, to, rel);
    else fs.copyFileSync(from, to);
  }
}

function copyScripts(destRoot) {
  const srcScripts = path.join(TEMPLATE_ROOT, "scripts");
  const destScripts = path.join(destRoot, "scripts");
  fs.mkdirSync(destScripts, { recursive: true });
  for (const ent of fs.readdirSync(srcScripts, { withFileTypes: true })) {
    const from = path.join(srcScripts, ent.name);
    const to = path.join(destScripts, ent.name);
    if (ent.isDirectory()) {
      fs.cpSync(from, to, { recursive: true });
    } else if (ent.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

function main() {
  const raw = process.argv.slice(2);
  let git = false;
  const args = raw.filter((a) => {
    if (a === "--git") {
      git = true;
      return false;
    }
    return true;
  });
  if (args.length < 1 || args[0] === "--help" || args[0] === "-h") usage();

  const rawName = args[0];
  const kebab = toKebab(rawName);
  if (!kebab) {
    console.error("Invalid project name.");
    process.exit(1);
  }

  const destArg = args[1];
  const destRoot = path.resolve(process.cwd(), destArg ?? kebab);

  if (fs.existsSync(destRoot)) {
    console.error(`Destination already exists: ${destRoot}`);
    process.exit(1);
  }

  console.error(`Creating ${destRoot} from template…`);
  copyTree(TEMPLATE_ROOT, destRoot);
  patchRootPackageJson(destRoot, kebab);
  patchLayoutMetadata(destRoot, toTitle(kebab));
  copyScripts(destRoot);

  if (git) {
    const r = spawnSync("git", ["init"], { cwd: destRoot, stdio: "inherit" });
    if (r.error || r.status !== 0) {
      console.error(
        "Warning: git init failed; run `git init` manually in the new folder."
      );
    }
  }

  console.log(`
Done.

  cd ${path.relative(process.cwd(), destRoot) || "."}
  pnpm install
  ${git ? "" : "git init\n  "}pnpm run dev
`);
}

main();
