"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  deleteMyAccount,
  getMe,
  getMySessions,
  updateMe,
  uploadMyAvatar,
} from "@/services/user";
import type { UserProfile, UserSession } from "@/types/user";
import type { ColumnDef } from "@tanstack/react-table";
import { Camera, LogOut, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  if (parts[0]?.[0]) return parts[0][0].toUpperCase();
  return "U";
}

export function ProfilePage() {
  const { user, clearAuth } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<UserSession[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [me, ss] = await Promise.all([getMe(), getMySessions()]);
      setProfile(me);
      setSessions(ss);
      setNameDraft(me.name ?? "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load profile");
      setProfile(null);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile !== null || sessions !== null) return;
    void load();
  }, [load, profile, sessions]);

  const columns = useMemo<ColumnDef<UserSession>[]>(() => {
    return [
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        accessorKey: "expiresAt",
        header: "Expires",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.expiresAt)}
          </span>
        ),
      },
      {
        accessorKey: "ipAddress",
        header: "IP",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.ipAddress ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "userAgent",
        header: "User agent",
        cell: ({ row }) => (
          <span className="block max-w-[22rem] truncate text-sm text-muted-foreground">
            {row.original.userAgent ?? "—"}
          </span>
        ),
      },
    ];
  }, []);

  if (profile === null && sessions === null) {
    return (
      <div className="px-4 py-6 lg:px-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  const displayName = profile?.name ?? user?.name ?? user?.email ?? "User";
  const displayEmail = profile?.email ?? user?.email ?? "";

  return (
    <div className="py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
            <p className="mt-2 text-muted-foreground">
              Update your details and review active sessions.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void load()}
            disabled={loading}
          >
            <RefreshCw
              data-icon="inline-start"
              className={cn(loading ? "animate-spin" : "")}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage alt={displayName} src={profile?.image ?? undefined} />
                <AvatarFallback className="rounded-lg bg-muted text-foreground">
                  {initialsFromName(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid">
                <span className="truncate">{displayName}</span>
                <span className="truncate text-sm font-normal text-muted-foreground">
                  {displayEmail}
                </span>
              </div>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="px-1.5 text-muted-foreground">
                {user?.role ?? "USER"}
              </Badge>
              {profile?.emailVerified ? (
                <Badge variant="outline" className="px-1.5 text-muted-foreground">
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="px-1.5 text-muted-foreground">
                  Unverified
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const updated = await updateMe({ name: nameDraft });
                    setProfile(updated);
                    toast.success("Profile updated");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Update failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Save changes
              </Button>

              <Label className="sr-only" htmlFor="avatar">
                Upload avatar
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setLoading(true);
                    const updated = await uploadMyAvatar(file);
                    setProfile(updated);
                    toast.success("Avatar updated");
                  } catch (err) {
                    toast.error(
                      err instanceof Error ? err.message : "Avatar upload failed",
                    );
                  } finally {
                    setLoading(false);
                    e.target.value = "";
                  }
                }}
              />
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => {
                  const el = document.getElementById("avatar") as
                    | HTMLInputElement
                    | null;
                  el?.click();
                }}
              >
                <Camera data-icon="inline-start" />
                Change avatar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  clearAuth();
                  window.location.href = "/auth/login";
                }}
              >
                <LogOut data-icon="inline-start" />
                Sign out (local)
              </Button>
              <Button
                variant="danger"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 data-icon="inline-start" />
                Delete account
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Active sessions for your account (read-only).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {sessions ? (
              <DataTable
                data={sessions}
                columns={columns}
                getRowId={(s) => s.id}
                enableReorder={false}
                enableRowSelection={false}
                toolbarLeft={
                  <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {sessions.length} sessions
                  </Badge>
                }
                emptyMessage="No sessions found."
              />
            ) : (
              <div className="px-4 pb-6">
                <Skeleton className="h-10 w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This action is permanent. Type <span className="font-medium">DELETE</span> to
              confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="delete-confirm" className="sr-only">
              Confirm
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={loading || deleteConfirm.trim() !== "DELETE"}
              onClick={async () => {
                try {
                  setLoading(true);
                  await deleteMyAccount();
                  toast.success("Account deleted");
                  clearAuth();
                  window.location.href = "/";
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Delete failed");
                } finally {
                  setLoading(false);
                  setDeleteDialogOpen(false);
                  setDeleteConfirm("");
                }
              }}
            >
              {loading ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

