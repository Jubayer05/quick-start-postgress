import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Sparkles } from "lucide-react";

export default function ComingSoonPage() {
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
            <Sparkles className="size-6 text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Coming soon</h1>
            <p className="text-sm text-balance text-muted-foreground">
              This page is under construction. We’re polishing the experience and will be back shortly.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

