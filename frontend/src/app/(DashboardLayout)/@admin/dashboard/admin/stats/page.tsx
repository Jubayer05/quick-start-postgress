"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminGetStats } from "@/services/admin";
import type { AdminStats } from "@/types/admin";
import { Activity, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="flex items-center justify-between gap-2">
          <span>{title}</span>
          <Badge variant="outline" className="px-2 text-muted-foreground">
            {icon}
          </Badge>
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value.toLocaleString()}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const s = await adminGetStats();
        if (!active) return;
        setStats(s);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load stats");
        if (!active) return;
        setStats(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin stats</h1>
          <p className="mt-2 text-muted-foreground">
            Quick overview of users and sessions.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        {loading ? (
          <>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Total users"
              value={stats.totalUsers}
              icon={<Users className="size-4" aria-hidden />}
            />
            <StatCard
              title="Verified users"
              value={stats.verifiedUsers}
              icon={<Shield className="size-4" aria-hidden />}
            />
            <StatCard
              title="Banned users"
              value={stats.bannedUsers}
              icon={<Users className="size-4" aria-hidden />}
            />
            <StatCard
              title="Total sessions"
              value={stats.totalSessions}
              icon={<Activity className="size-4" aria-hidden />}
            />
          </>
        ) : (
          <div className="col-span-full rounded-xl border p-6 text-sm text-muted-foreground">
            Unable to load stats.
          </div>
        )}
      </div>
    </div>
  );
}

