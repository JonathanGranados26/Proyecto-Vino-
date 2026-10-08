import { Module } from '@nestjs/common';
import { ProductsImportController } from './products-import.controller';

@Module({
  controllers: [ProductsImportController],
})
export class ProductsImportModule {}