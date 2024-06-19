import { Request } from "express";

export const fileName = (req: Request, file: Express.Multer.File, cb: (error: Error | null, fileName: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
}