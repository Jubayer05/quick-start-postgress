"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  adminBanUser,
  adminDeleteUser,
  adminListUsers,
  adminUnbanUser,
  adminUpdateUserRole,
} from "@/services/admin";
import type { AdminUser } from "@/types/admin";
import type { ColumnDef } from "@tanstack/react-table";
import { RefreshCw, UserCog, UserX, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type DialogMode = "role" | "ban" | "unban" | "delete" | null;

const ROLE_OPTIONS: Array<AdminUser["role"]> = ["ADMIN", "MODERATOR", "USER"];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [roleDraft, setRoleDraft] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await adminListUsers();
      setUsers(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (users !== null) return;
    void load();
  }, [load, users]);

  const openDialog = (mode: DialogMode, user: AdminUser) => {
    setSelected(user);
    setDialogMode(mode);
    setRoleDraft(user.role);
    setConfirmEmail("");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelected(null);
    setRoleDraft("");
    setConfirmEmail("");
  };

  const columns = useMemo<ColumnDef<AdminUser>[]>(() => {
    return [
      {
        accessorKey: "email",
        header: "User",
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{u.name || u.email}</span>
              <span className="text-xs text-muted-foreground">{u.email}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {String(row.original.role)}
          </Badge>
        ),
      },
      {
        accessorKey: "emailVerified",
        header: "Verified",
        cell: ({ row }) =>
          row.original.emailVerified ? (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              Yes
            </Badge>
          ) : (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              No
            </Badge>
          ),
      },
      {
        accessorKey: "bannedAt",
        header: "Status",
        cell: ({ row }) =>
          row.original.bannedAt ? (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              Banned
            </Badge>
          ) : (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              Active
            </Badge>
          ),
      },
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
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDialog("role", u)}
              >
                <UserCog data-icon="inline-start" />
                Role
              </Button>
              {u.bannedAt ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialog("unban", u)}
                >
                  Unban
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialog("ban", u)}
                >
                  <UserX data-icon="inline-start" />
                  Ban
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => openDialog("delete", u)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ];
  }, []);

  const toolbarLeft = (
    <div className="flex items-center gap-2">
      <Users className="size-4 text-muted-foreground" aria-hidden />
      <span className="text-sm font-medium">Users</span>
      {users ? (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {users.length}
        </Badge>
      ) : null}
    </div>
  );

  const toolbarRight = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => void load()}
      disabled={loading}
    >
      <RefreshCw data-icon="inline-start" className={loading ? "animate-spin" : ""} />
      Refresh
    </Button>
  );

  if (users === null) {
    return (
      <div className="px-4 py-6 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-2 text-muted-foreground">
          Manage roles, bans, and account removal.
        </p>
      </div>

      <div className="mt-6">
        <DataTable
          data={users}
          columns={columns}
          getRowId={(u) => u.id}
          enableReorder={false}
          toolbarLeft={toolbarLeft}
          toolbarRight={toolbarRight}
          emptyMessage="No users found."
        />
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => (open ? null : closeDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "role"
                ? "Update role"
                : dialogMode === "ban"
                  ? "Ban user"
                  : dialogMode === "unban"
                    ? "Unban user"
                    : dialogMode === "delete"
                      ? "Delete user"
                      : "User action"}
            </DialogTitle>
            <DialogDescription>
              {selected?.email ? (
                <span className="text-muted-foreground">{selected.email}</span>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === "role" && selected ? (
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select value={roleDraft} onValueChange={setRoleDraft}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {dialogMode === "ban" && selected ? (
            <div className="text-sm text-muted-foreground">
              This will suspend the account and revoke active sessions.
            </div>
          ) : null}

          {dialogMode === "unban" && selected ? (
            <div className="text-sm text-muted-foreground">
              This will restore access for the account.
            </div>
          ) : null}

          {dialogMode === "delete" && selected ? (
            <div className="grid gap-3">
              <div className="text-sm text-muted-foreground">
                This action is permanent. Type the user&apos;s email to confirm.
              </div>
              <Label htmlFor="confirm-email" className="sr-only">
                Confirm email
              </Label>
              <Input
                id="confirm-email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={selected.email}
              />
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant={dialogMode === "delete" ? "danger" : "primary"}
              disabled={
                !selected ||
                loading ||
                (dialogMode === "role" && roleDraft.trim() === "") ||
                (dialogMode === "delete" && confirmEmail.trim() !== selected?.email)
              }
              onClick={async () => {
                if (!selected || !dialogMode) return;
                setLoading(true);
                try {
                  if (dialogMode === "role") {
                    const updated = await adminUpdateUserRole(
                      selected.id,
                      roleDraft,
                    );
                    setUsers((prev) =>
                      (prev ?? []).map((u) => (u.id === updated.id ? updated : u)),
                    );
                    toast.success("Role updated");
                    closeDialog();
                    return;
                  }
                  if (dialogMode === "ban") {
                    const updated = await adminBanUser(selected.id);
                    setUsers((prev) =>
                      (prev ?? []).map((u) => (u.id === updated.id ? updated : u)),
                    );
                    toast.success("User banned");
                    closeDialog();
                    return;
                  }
                  if (dialogMode === "unban") {
                    const updated = await adminUnbanUser(selected.id);
                    setUsers((prev) =>
                      (prev ?? []).map((u) => (u.id === updated.id ? updated : u)),
                    );
                    toast.success("User unbanned");
                    closeDialog();
                    return;
                  }
                  if (dialogMode === "delete") {
                    await adminDeleteUser(selected.id);
                    setUsers((prev) => (prev ?? []).filter((u) => u.id !== selected.id));
                    toast.success("User deleted");
                    closeDialog();
                    return;
                  }
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Action failed");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Working…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

