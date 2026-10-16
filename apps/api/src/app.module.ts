import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ProductsImportModule } from './products/products-import.module';

@Module({
  imports: [
    // Configuración de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: true,
      // ❌ REMOVIDO: cors no es una propiedad de ApolloDriverConfig
      // ✅ CORS se configura en main.ts con app.enableCors()
    }),

    // Configuración de Cache con Redis
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        ttl: 300,
        max: 100,
      }),
    }),

    // Configuración de Rate Limiting - SIN guard global
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Módulos de la aplicación
    AuthModule,
    ProductsModule,
    ProductsImportModule,
    UploadModule,
  ],
})
export class AppModule {}