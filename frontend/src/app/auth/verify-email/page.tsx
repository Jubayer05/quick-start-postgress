import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { BadgeCheck, CircleAlert } from "lucide-react";
import Link from "next/link";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function pickFirst(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  return Array.isArray(v) ? v[0] : undefined;
}

export default function VerifyEmailPage({ searchParams }: PageProps) {
  const error = pickFirst(searchParams?.error) ?? pickFirst(searchParams?.err);
  const message =
    pickFirst(searchParams?.message) ??
    pickFirst(searchParams?.msg) ??
    pickFirst(searchParams?.reason);

  const ok = !error;

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

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-border bg-muted/40">
            {ok ? (
              <BadgeCheck className="size-6 text-primary" />
            ) : (
              <CircleAlert className="size-6 text-destructive" />
            )}
          </div>

          <div className="mt-4 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {ok ? "Email verified" : "Verification failed"}
            </h1>
            <p className="text-sm text-balance text-muted-foreground">
              {ok
                ? "Your email is verified. You can now sign in."
                : message ??
                  "We couldn’t verify your email. The link may be expired or invalid."}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/auth/login">Go to login</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/auth/register">Create account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

