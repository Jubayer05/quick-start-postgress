import "dotenv/config";
import nodemailer from "nodemailer";
import path from "node:path";
import { readFile } from "node:fs/promises";

type MailTemplateName =
  | "verify-email.html"
  | "reset-password.html"
  | "welcome.html"
  | "banned.html";

type SendTemplateEmailArgs = {
  to: string;
  subject: string;
  template: MailTemplateName;
  variables: Record<string, string>;
  textFallback?: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing ${name}. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM in backend/.env`,
    );
  }
  return value;
}

const transporter = nodemailer.createTransport({
  host: requiredEnv("SMTP_HOST"),
  port: Number(requiredEnv("SMTP_PORT")),
  auth: {
    user: requiredEnv("SMTP_USER"),
    pass: requiredEnv("SMTP_PASSWORD"),
  },
});

function templateDir(): string {
  // Prefer running from the backend package root (pnpm --prefix backend ...)
  return path.resolve(process.cwd(), "src", "templates");
}

function interpolate(html: string, vars: Record<string, string>): string {
  return html.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
    return vars[key] ?? "";
  });
}

export async function sendTemplateEmail(args: SendTemplateEmailArgs): Promise<void> {
  const from = requiredEnv("SMTP_FROM");
  const filePath = path.join(templateDir(), args.template);
  const raw = await readFile(filePath, "utf8");
  const html = interpolate(raw, args.variables);
  const text =
    args.textFallback ??
    (args.variables.url
      ? `${args.subject}: ${args.variables.url}`
      : args.subject);

  await transporter.sendMail({
    from,
    to: args.to,
    subject: args.subject,
    text,
    html,
  });
}

