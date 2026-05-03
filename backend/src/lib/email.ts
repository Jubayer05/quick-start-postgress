import "dotenv/config";
import nodemailer from "nodemailer";

type SendEmailArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
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

export async function verifyEmailTransport(): Promise<void> {
  await transporter.verify();
}

export async function sendEmail(args: SendEmailArgs): Promise<void> {
  const from = requiredEnv("SMTP_FROM");

  await transporter.sendMail({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
  });
}
