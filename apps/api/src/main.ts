import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  dotenv.config({ path: join(process.cwd(), '.env') });

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  
    // Configuración de CORS para permitir múltiples dominios
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://proyecto-vino-qdkn-six.vercel.app',
      'https://proyecto-vino-qdkn-547q0w0uo-vendimia-del-corazon.vercel.app',
      'https://proyecto-vino.onrender.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API running on port ${port}`);
}

bootstrap();