"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, RotateCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { resetPassword } from "@/services/auth";

export function ResetPasswordForm({
  token,
  className,
  ...props
}: React.ComponentProps<"form"> & { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordType = useMemo(
    () => (showPassword ? "text" : "password"),
    [showPassword],
  );
  const confirmPasswordType = useMemo(
    () => (showConfirmPassword ? "text" : "password"),
    [showConfirmPassword],
  );

  const schema = useMemo(
    () =>
      z
        .object({
          newPassword: z.string().min(8, "At least 8 characters"),
          confirmPassword: z.string().min(1, "Confirm your password"),
        })
        .superRefine(({ newPassword, confirmPassword }, ctx) => {
          if (newPassword !== confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords do not match",
              path: ["confirmPassword"],
            });
          }
        }),
    [],
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const res = await resetPassword({ token, newPassword: values.newPassword });
      toast.success(res.message ?? "Password reset successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reset failed");
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="grid place-items-center rounded-2xl border border-border bg-muted/40 p-3">
            <RotateCw className="size-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-balance text-muted-foreground">
              Choose a new password for your account.
            </p>
          </div>
        </div>

        <Field>
          <FieldLabel htmlFor="newPassword">New password</FieldLabel>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="newPassword"
              type={passwordType}
              autoComplete="new-password"
              required
              className="bg-background pl-9 pr-10"
              placeholder="••••••••"
              {...form.register("newPassword")}
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.formState.errors.newPassword?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.newPassword.message}
            </p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={confirmPasswordType}
              autoComplete="new-password"
              required
              className="bg-background pl-9 pr-10"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {form.formState.errors.confirmPassword?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </Field>

        <Field>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Resetting…" : "Reset password"}
          </Button>
          <FieldDescription className="text-center">
            <Link href="/auth/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

