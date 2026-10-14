import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  dotenv.config({ path: join(process.cwd(), '.env') });

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  
  // Configuración de CORS para permitir múltiples dominios de producción y desarrollo
  app.enableCors({
    origin: [
      'http://localhost:3000',       // Web local
      'http://localhost:3001',       // Admin local
      'https://proyecto-vino-qdkn-six.vercel.app', // Web en producción (Vercel)
      'https://proyecto-vino-qdkn-547q0w0uo-vendimia-del-corazon.vercel.app', // Preview de Vercel
      'https://jonathangranados26.github.io', // Admin en producción (GitHub Pages)
      'https://proyecto-vino.onrender.com', // La propia API (por si hace peticiones internas)
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API running on port ${port}`);
}

bootstrap();