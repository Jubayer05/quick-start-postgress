"use client";

import { RegisterForm } from "@/components/forms/register-form";
import { Logo } from "@/components/shared/logo";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo
            href="/"
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
            alt="Quick Start"
            title="Quick Start"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
