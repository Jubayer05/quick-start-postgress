import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import { sendTemplateEmail } from "./mailer.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [
    (process.env.FRONTEND_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const appName = process.env.APP_NAME ?? "YourApp";
      void sendTemplateEmail({
        to: user.email,
        subject: "Reset your password",
        template: "reset-password.html",
        variables: {
          appName,
          userName: (user.name ?? "there").toString(),
          url,
        },
        textFallback: `Reset your password: ${url}`,
      }).catch((err) => {
        console.error("Reset password email failed:", err);
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const appName = process.env.APP_NAME ?? "YourApp";
      void sendTemplateEmail({
        to: user.email,
        subject: "Verify your email address",
        template: "verify-email.html",
        variables: {
          appName,
          userName: (user.name ?? "there").toString(),
          url,
        },
        textFallback: `Verify your email: ${url}`,
      }).catch((err) => {
        console.error("Verification email failed:", err);
      });
    },
    afterEmailVerification: async (user) => {
      const appName = process.env.APP_NAME ?? "YourApp";
      void sendTemplateEmail({
        to: user.email,
        subject: `Welcome to ${appName}`,
        template: "welcome.html",
        variables: {
          appName,
          userName: (user.name ?? "there").toString(),
        },
      }).catch((err) => {
        console.error("Welcome email failed:", err);
      });
    },
  },
});

export const authClient = auth;

