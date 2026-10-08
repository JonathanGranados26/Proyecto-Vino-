import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  dotenv.config({ path: join(process.cwd(), '.env') });

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  
  // CORS para producción con túneles
  app.enableCors({
    origin: [
      'https://joyce-slides-grades-ears.trycloudflare.com',
      'https://participants-resistance-engines-lane.trycloudflare.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API running on port ${port}`);
}

bootstrap();