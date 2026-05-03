#!/usr/bin/env node
/**
 * Create a new project from this template.
 * Usage: node scripts/create-project.mjs <project-name> [destination-dir] [--git]
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  console.error(`Usage: node scripts/create-project.mjs <project-name> [destination] [--git]

  project-name   npm-style name (e.g. acme-crm); becomes root package name & app title
  destination    folder to create (default: ./<project-name>)
  --git          run git init in the new folder`);
  process.exit(1);
}

function toKebab(raw) {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toTitle(kebab) {
  return kebab
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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

function patchRootPackageJson(destRoot, name) {
  const p = path.join(destRoot, "package.json");
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j.name = name;
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`, "utf8");
}

function patchLayoutMetadata(destRoot, title) {
  const layoutPath = path.join(destRoot, "frontend", "src", "app", "layout.tsx");
  if (!fs.existsSync(layoutPath)) return;
  let s = fs.readFileSync(layoutPath, "utf8");
  const safe = title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  s = s.replace(/title:\s*"[^"]*"/, `title: "${safe}"`);
  fs.writeFileSync(layoutPath, s, "utf8");
}

function copyCreateScript(destRoot) {
  const src = path.join(TEMPLATE_ROOT, "scripts", "create-project.mjs");
  const dir = path.join(destRoot, "scripts");
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, path.join(dir, "create-project.mjs"));
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
  const destRoot = path.resolve(
    process.cwd(),
    destArg ?? kebab
  );

  if (fs.existsSync(destRoot)) {
    console.error(`Destination already exists: ${destRoot}`);
    process.exit(1);
  }

  console.error(`Creating ${destRoot} from template…`);
  copyTree(TEMPLATE_ROOT, destRoot);
  patchRootPackageJson(destRoot, kebab);
  patchLayoutMetadata(destRoot, toTitle(kebab));
  copyCreateScript(destRoot);

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
