import { Controller, Get, Post, UploadedFile, UseInterceptors, BadRequestException, Param, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { ImageResourceService } from './image-resource.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileOptions } from './helpers/fileOptions';
import { diskStorage } from 'multer';
import { fileName } from './helpers/fileName';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


@Controller('image')
export class ImageResourceController {
  constructor(private readonly imageResourceService: ImageResourceService) { }

  @Post('upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file',
    {
      fileFilter: fileOptions,
      storage: diskStorage({
        destination: './static/images/',
        filename: fileName
      })
    }
  ))
  uploadImage(@UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException("File is required");
    }

    return {
      file: file.filename,
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.imageResourceService.getAllImages();
  }

  @Get('gray/:filename')
  @UseGuards(AuthGuard())
  async convertToGrayScale(@Param('filename') filename: string, @Res() res): Promise<any> {

    const grayImageBuffer = await this.imageResourceService.convertToGrayScale(filename);
    res.set('Content-Type', 'image/jpeg');
    return res.send(grayImageBuffer);

  }

  @Get('resize/:filename/:width')
  @UseGuards(AuthGuard())
  async resizeImage(@Param('filename') filename: string, @Param('width') width: number, @Res() res): Promise<any> {
    const resizedImageBuffer = await this.imageResourceService.resizeImage(filename, +width);
    res.set('Content-Type', 'image/jpeg');
    return res.send(resizedImageBuffer);
  }

  @Get('rotate/:filename/:angle')
  @UseGuards(AuthGuard())
  async rotateImage(@Param('filename') filename: string, @Param('angle') angle: number, @Res() res): Promise<any> {

    const rotatedImageBuffer = await this.imageResourceService.rotateImage(filename, +angle);
    res.set('Content-Type', 'image/jpeg');
    return res.send(rotatedImageBuffer);

  }

  @Get('processed/:filename')
  @UseGuards(AuthGuard())
  async getProcessedFile(@Param('filename') filename: string, @Res() res: Response) {

    const filePath = await this.imageResourceService.getProcessedFilePath(filename);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.sendFile(filePath);

  }

}
