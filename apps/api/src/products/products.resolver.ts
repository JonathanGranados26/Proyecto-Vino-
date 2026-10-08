import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductType } from './dto/product.dto';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [ProductType], { name: 'products' })
  async findAll(): Promise<ProductType[]> {
    return this.productsService.findAll();
  }

  @Query(() => ProductType, { name: 'product', nullable: true })
  async findOne(@Args('id') id: string): Promise<ProductType | null> {
    return this.productsService.findOne(id);
  }

  @Query(() => ProductType, { name: 'productBySlug', nullable: true })
  async findBySlug(@Args('slug') slug: string): Promise<ProductType | null> {
    return this.productsService.findBySlug(slug);
  }

  @Query(() => [ProductType], { name: 'productsByCategory' })
  async findByCategory(@Args('category') category: string): Promise<ProductType[]> {
    return this.productsService.findByCategory(category);
  }

  @Mutation(() => ProductType)
  @UseGuards(GqlAuthGuard)
  async createProduct(@Args('input') input: CreateProductInput): Promise<ProductType> {
    return this.productsService.create(input);
  }

@Query(() => [ProductType], { name: 'relatedProducts' })
async findRelated(
  @Args('category') category: string,
  @Args('excludeId') excludeId: string,
  @Args('limit', { defaultValue: 4 }) limit: number,
): Promise<ProductType[]> {
  return this.productsService.findRelated(category, excludeId, limit);
}

  @Mutation(() => ProductType)
  @UseGuards(GqlAuthGuard)
  async updateProduct(@Args('input') input: UpdateProductInput): Promise<ProductType> {
    const { id, ...data } = input;
    return this.productsService.update(id, data);
  }

  @Mutation(() => ProductType)
  @UseGuards(GqlAuthGuard)
  async deleteProduct(@Args('id') id: string): Promise<ProductType> {
    return this.productsService.remove(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async permanentlyDeleteProduct(@Args('id') id: string): Promise<boolean> {
    await this.productsService.delete(id);
    return true;
  }
}