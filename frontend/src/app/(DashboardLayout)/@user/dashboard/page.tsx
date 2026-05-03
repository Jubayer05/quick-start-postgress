"use client";

import { useAuth } from "@/context/auth-context";

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{user?.email}</span>.
      </p>
    </div>
  );
}
