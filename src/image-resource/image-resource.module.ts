import { Module } from '@nestjs/common';
import { ImageResourceService } from './image-resource.service';
import { ImageResourceController } from './image-resource.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ImageResourceController],
  providers: [ImageResourceService],
  imports: [
    AuthModule
  ],
})
export class ImageResourceModule {}
