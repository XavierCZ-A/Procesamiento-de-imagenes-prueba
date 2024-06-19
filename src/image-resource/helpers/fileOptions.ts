import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

// const fileExptension = file.mimetype.split('/')[1];
const allowedMimeTypes = ['image/png', 'image/jpeg'];
// const maxSize = 5 * 1024 * 1024;

export const fileOptions = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('Only images are allowed, .PNG y .JPG'), false);
    }

    // if (file.size > maxSize) {
    //     return cb(new BadRequestException('El archivo no debe superar los 5MB'), false);
    // }

    cb(null, true);
};
