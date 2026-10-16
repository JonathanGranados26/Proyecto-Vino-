import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ProductsImportModule } from './products/products-import.module';

@Module({
  imports: [
    // Configuración de GraphQL con formato de errores personalizado
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: true,
      // Formato personalizado de errores para exponer validaciones de Zod
      formatError: (error) => {
        // Type assertion para acceder a las propiedades de extensions
        const extensions = error.extensions as any;
        
        // Si el error tiene una respuesta detallada (de Zod), la exponemos
        if (extensions?.exception?.response) {
          const response = extensions.exception.response;
          return {
            message: response.message || error.message,
            errors: response.errors || [],
            extensions: {
              code: extensions.code || 'BAD_REQUEST',
            },
          };
        }
        
        // Si no tiene respuesta detallada, retornamos el error original
        return error;
      },
    }),

    // Módulos de la aplicación
    AuthModule,
    ProductsModule,
    ProductsImportModule,
    UploadModule,
  ],
})
export class AppModule {}