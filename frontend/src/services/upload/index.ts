import { API_ENDPOINTS } from "@/config/apiConfig";

export type UploadSingleResponse = {
  message: string;
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
};

/**
 * Upload a file to Cloudinary via the API (multipart field name: `file`).
 * Returns the HTTPS `url` to store on the user profile.
 */
export const uploadSinglePhoto = async (
  file: File,
): Promise<UploadSingleResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_ENDPOINTS.upload.single, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const json = (await response.json()) as UploadSingleResponse & {
    message?: string;
    error?: unknown;
  };

  if (!response.ok) {
    throw new Error(json.message ?? "Upload failed");
  }

  if (!json.url) {
    throw new Error("Upload response did not include a file URL");
  }

  return json;
};
