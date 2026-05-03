import fs from "node:fs";
import path from "node:path";

const TEMPLATE_PLACEHOLDER_NAME = "monorepo-template";

export { TEMPLATE_PLACEHOLDER_NAME };

export function toKebab(raw) {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function toTitle(kebab) {
  return kebab
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getRootPackageName(projectRoot) {
  const p = path.join(projectRoot, "package.json");
  if (!fs.existsSync(p)) return null;
  try {
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    return typeof j.name === "string" ? j.name : null;
  } catch {
    return null;
  }
}

export function patchRootPackageJson(projectRoot, name) {
  const p = path.join(projectRoot, "package.json");
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j.name = name;
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`, "utf8");
}

export function patchLayoutMetadata(projectRoot, title) {
  const layoutPath = path.join(
    projectRoot,
    "frontend",
    "src",
    "app",
    "layout.tsx"
  );
  if (!fs.existsSync(layoutPath)) return;
  let s = fs.readFileSync(layoutPath, "utf8");
  const safe = title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  s = s.replace(/title:\s*"[^"]*"/, `title: "${safe}"`);
  fs.writeFileSync(layoutPath, s, "utf8");
}

export function isUnbootstrappedTemplate(projectRoot) {
  return getRootPackageName(projectRoot) === TEMPLATE_PLACEHOLDER_NAME;
}
