 "use client";

import { Logo } from "@/components/shared/logo";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

function readTokenFromHash(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  return (
    params.get("token") ??
    params.get("resetToken") ??
    params.get("reset_token") ??
    params.get("code") ??
    null
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => {
    const fromSearch =
      searchParams.get("token") ??
      searchParams.get("resetToken") ??
      searchParams.get("reset_token") ??
      searchParams.get("code");

    if (typeof window === "undefined") return fromSearch;
    return readTokenFromHash(window.location.hash) ?? fromSearch;
  }, [searchParams]);

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
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="grid place-items-center rounded-2xl border border-border bg-muted/40 p-3">
                <CircleAlert className="size-5 text-destructive" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Invalid reset link
                </h1>
                <p className="text-sm text-balance text-muted-foreground">
                  This password reset link is missing a token. Please request a new one.
                </p>
              </div>
              <Button variant="primary" size="lg" className="w-full" asChild>
                <Link href="/auth/forgot-password">Request new link</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

