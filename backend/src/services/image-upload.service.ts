import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured(): void {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured (missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

export async function uploadAvatarFile(params: {
  userId: string;
  buffer: Buffer;
  mimetype?: string;
}): Promise<{ url: string; publicId: string }> {
  ensureConfigured();

  const { userId, buffer, mimetype } = params;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        public_id: `user_${userId}`,
        overwrite: true,
        resource_type: "image",
        context: mimetype ? { mimetype } : undefined,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    stream.end(buffer);
  });
}

export async function uploadAvatarImage(params: {
  userId: string;
  image: string; // data URL or base64 string or remote URL
}): Promise<{ url: string; publicId: string }> {
  ensureConfigured();

  const { userId, image } = params;
  const input = image.trim();

  const result = await cloudinary.uploader.upload(input, {
    folder: "avatars",
    public_id: `user_${userId}`,
    overwrite: true,
    resource_type: "image",
  });

  return { url: result.secure_url, publicId: result.public_id };
}

