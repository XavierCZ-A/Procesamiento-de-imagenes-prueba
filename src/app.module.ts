import { Module } from '@nestjs/common';
import { ImageResourceModule } from './image-resource/image-resource.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ImageResourceModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
})
export class AppModule {}
