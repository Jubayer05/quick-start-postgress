import type { Request, Response } from "express";
import {
  banUser,
  deleteUser,
  getStats,
  listUsers,
  unbanUser,
  updateRole,
} from "./admin.service.js";

function requireUserIdParam(req: Request, res: Response): string | null {
  const id = typeof req.params.id === "string" ? req.params.id.trim() : "";
  if (!id) {
    res.status(400).json({ error: "Bad Request", message: "User id is required" });
    return null;
  }
  return id;
}

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await listUsers();
    res.status(200).json({ message: "Users retrieved", data: users });
  } catch (error: unknown) {
    console.error("List users error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to list users";
    res.status(500).json({ error: "List users failed", message });
  }
};

export const patchUserRole = async (req: Request, res: Response) => {
  try {
    const userId = requireUserIdParam(req, res);
    if (!userId) return;

    const { role } = req.body as { role?: string };
    if (typeof role !== "string" || role.trim() === "") {
      res.status(400).json({
        error: "Update role failed",
        message: "role is required",
      });
      return;
    }

    const updated = await updateRole(userId, role);
    res.status(200).json({ message: "Role updated", data: updated });
  } catch (error: unknown) {
    console.error("Update role error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update role";
    res.status(500).json({ error: "Update role failed", message });
  }
};

export const postUserBan = async (req: Request, res: Response) => {
  try {
    const userId = requireUserIdParam(req, res);
    if (!userId) return;

    const updated = await banUser(userId);
    res.status(200).json({ message: "User banned", data: updated });
  } catch (error: unknown) {
    console.error("Ban user error:", error);
    const message = error instanceof Error ? error.message : "Failed to ban user";
    res.status(500).json({ error: "Ban user failed", message });
  }
};

export const postUserUnban = async (req: Request, res: Response) => {
  try {
    const userId = requireUserIdParam(req, res);
    if (!userId) return;

    const updated = await unbanUser(userId);
    res.status(200).json({ message: "User unbanned", data: updated });
  } catch (error: unknown) {
    console.error("Unban user error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to unban user";
    res.status(500).json({ error: "Unban user failed", message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = requireUserIdParam(req, res);
    if (!userId) return;

    const result = await deleteUser(userId);
    res.status(200).json({ message: "User deleted", data: result });
  } catch (error: unknown) {
    console.error("Delete user error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete user";
    res.status(500).json({ error: "Delete user failed", message });
  }
};

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getStats();
    res.status(200).json({ message: "Stats retrieved", data: stats });
  } catch (error: unknown) {
    console.error("Get stats error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load stats";
    res.status(500).json({ error: "Get stats failed", message });
  }
};

