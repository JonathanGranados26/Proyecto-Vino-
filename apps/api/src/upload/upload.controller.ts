import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
          return callback(new Error('Solo se permiten imágenes (JPG, PNG, WEBP, GIF)'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log(' Recibiendo archivo:', file.originalname, file.size, 'bytes');
      const url = await this.uploadService.uploadImage(file);
      console.log('✅ Imagen subida:', url);
      return { url, success: true };
    } catch (error) {
      console.error('❌ Error al subir:', error);
      throw error;
    }
  }
}

