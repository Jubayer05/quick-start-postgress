declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      session?: {
        id: string;
        userId: string;
      };
      file?: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
        size: number;
      };
      files?: unknown;
    }
  }
}

export {};

