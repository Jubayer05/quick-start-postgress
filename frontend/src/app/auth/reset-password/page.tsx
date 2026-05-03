import { Suspense } from "react";
import { ResetPasswordContent } from "./reset-password-content";

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="text-sm text-muted-foreground">Loading…</div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
