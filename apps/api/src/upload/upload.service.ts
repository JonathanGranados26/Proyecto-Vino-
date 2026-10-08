import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gws-wine-platform',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('☁️ Cloudinary error:', error);
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          }
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const match = imageUrl.match(/\/gws-wine-platform\/([^.]+)/);
    if (match) {
      await cloudinary.uploader.destroy(`gws-wine-platform/${match[1]}`);
    }
  }
}