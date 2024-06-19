import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as Sharp from 'sharp';

@Injectable()
export class ImageResourceService {
  private readonly processedImagesPath = './static/processedImages/';
  private readonly processedImagesPathRelative = path.resolve('./static/processedImages/');


  getAllImages() {
    const directoryPath = './static/images/';

    const files = fs.readdirSync(directoryPath);
    const filesProcessed = fs.readdirSync(this.processedImagesPath);

    const images = files.map(file => ({
      name: file,
      path: path.join(directoryPath, file),
    }));

    const imagesProcessed = filesProcessed.map(file => ({
      name: file,
      path: path.join(this.processedImagesPathRelative, file),
    }));

    return {
      images,
      imagesProcessed
    }
  }

  async convertToGrayScale(filename: string): Promise<Buffer> {
    try {
      const imagePath = `./static/images/${filename}`;
      const image = await fs.pathExists(imagePath);
      if (!image) throw new BadRequestException('Image not found');
      const imageBuffer = await fs.readFile(imagePath);
      const grayImageBuffer = await Sharp(imageBuffer).grayscale().toBuffer();
      await this.saveProcessedImage(grayImageBuffer, filename, 'grayscale');
      return grayImageBuffer;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resizeImage(filename: string, width: number): Promise<Buffer> {
    try {
      const imagePath = `./static/images/${filename}`;
      const image = await fs.pathExists(imagePath);
      if (!image) throw new BadRequestException('Image not found');
      const imageBuffer = await fs.readFile(imagePath);
      const imageResizedBuffer = await Sharp(imageBuffer).resize({ width }).toBuffer();
      await this.saveProcessedImage(imageResizedBuffer, filename, `resized-${width}`);
      return imageResizedBuffer;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async rotateImage(filename: string, angle: number): Promise<Buffer> {
    try {
      const imagePath = `./static/images/${filename}`;
      const image = await fs.pathExists(imagePath);
      if (!image) throw new BadRequestException('Image not found');
      const imageBuffer = await fs.readFile(imagePath);
      const rotatedImageBuffer = await Sharp(imageBuffer).rotate(angle).toBuffer();
      await this.saveProcessedImage(rotatedImageBuffer, filename, `rotated-${angle}`);
      return rotatedImageBuffer
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProcessedFilePath(filename: string): Promise<string> {
    try {
      const filePath = path.join(this.processedImagesPathRelative, filename);
      const exists = await fs.pathExists(filePath);
      if (!exists) {
        throw new NotFoundException('Processed image not found');
      }
      return filePath;
      
    } catch (error) {
      console.log(error);
      
    }
  }

  private async saveProcessedImage(buffer: Buffer, filename: string, suffix: string): Promise<string> {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const newFilename = `${name}-${suffix}${ext}`;
    const newPath = path.join(this.processedImagesPath, newFilename);
    await fs.writeFile(newPath, buffer);
    return newFilename;
  }

}
