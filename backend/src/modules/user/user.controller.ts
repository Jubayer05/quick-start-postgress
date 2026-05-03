import type { Request, Response } from "express";
import {
  uploadAvatarFile,
  uploadAvatarImage,
} from "../../services/image-upload.service.js";
import {
  deleteAccount,
  getProfile,
  getSessions,
  updateProfile,
  uploadAvatar,
} from "./user.service.js";

function requireUserId(req: Request, res: Response): string | null {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized", message: "Missing session" });
    return null;
  }
  return userId;
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const profile = await getProfile(userId);
    if (!profile) {
      res.status(404).json({ error: "Not Found", message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile retrieved", data: profile });
  } catch (error: unknown) {
    console.error("Get profile error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load profile";
    res.status(500).json({ error: "Get profile failed", message });
  }
};

export const patchMe = async (req: Request, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { name } = req.body as { name?: string };
    const updated = await updateProfile(userId, { name });

    res.status(200).json({ message: "Profile updated", data: updated });
  } catch (error: unknown) {
    console.error("Update profile error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    res.status(500).json({ error: "Update profile failed", message });
  }
};

export const postAvatar = async (req: Request, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    if (req.file && Buffer.isBuffer(req.file.buffer)) {
      const uploaded = await uploadAvatarFile({
        userId,
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
      });
      const updated = await uploadAvatar(userId, uploaded.url);
      res.status(200).json({ message: "Avatar updated", data: updated });
      return;
    }

    const { image } = req.body as { image?: string };
    if (typeof image !== "string" || image.trim() === "") {
      res.status(400).json({
        error: "Upload avatar failed",
        message: "avatar file or image is required",
      });
      return;
    }

    const uploaded = await uploadAvatarImage({ userId, image });
    const updated = await uploadAvatar(userId, uploaded.url);
    res.status(200).json({ message: "Avatar updated", data: updated });
  } catch (error: unknown) {
    console.error("Upload avatar error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload avatar";
    res.status(500).json({ error: "Upload avatar failed", message });
  }
};

export const getMySessions = async (req: Request, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const sessions = await getSessions(userId);
    res.status(200).json({ message: "Sessions retrieved", data: sessions });
  } catch (error: unknown) {
    console.error("Get sessions error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load sessions";
    res.status(500).json({ error: "Get sessions failed", message });
  }
};

export const deleteMe = async (req: Request, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await deleteAccount(userId);
    res.status(200).json({ message: "Account deleted", data: result });
  } catch (error: unknown) {
    console.error("Delete account error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete account";
    res.status(500).json({ error: "Delete account failed", message });
  }
};

