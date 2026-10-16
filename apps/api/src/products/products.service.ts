import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, Product as PrismaProduct } from '@prisma/client';
import { ProductType } from './dto/product.dto';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CreateProductSchema } from './dto/create-product.schema';

const prisma = new PrismaClient();

function mapProduct(product: PrismaProduct): ProductType {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    description: product.description || undefined,
    presentation: product.presentation,
    alcoholicDegree: product.alcoholicDegree,
    price: Number(product.price),
    currency: product.currency,
    stock: product.stock,
    country: product.country || undefined,
    region: product.region || undefined,
    grape: product.grape || undefined,
    vintage: product.vintage || undefined,
    score: product.score || undefined,
    pairing: product.pairing || undefined,
    imageUrl: product.imageUrl || undefined,
    images: product.images || [],
    tastingNotes: product.tastingNotes || [],
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

@Injectable()
export class ProductsService {
  constructor(@Inject(Cache) private cacheManager: Cache) {}

  async findAll(): Promise<ProductType[]> {
    const cacheKey = 'products:all:active';
    const cached = await this.cacheManager.get<ProductType[]>(cacheKey);
    if (cached) {
      console.log('[Cache HIT] findAll');
      return cached;
    }

    console.log('[Cache MISS] findAll - Querying DB');
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    const mapped = products.map(mapProduct);
    await this.cacheManager.set(cacheKey, mapped, 300);
    
    return mapped;
  }

  async findOne(id: string): Promise<ProductType | null> {
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<ProductType>(cacheKey);
    if (cached) {
      console.log('[Cache HIT] findOne:', id);
      return cached;
    }

    console.log('[Cache MISS] findOne:', id);
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    const mapped = mapProduct(product);
    await this.cacheManager.set(cacheKey, mapped, 300);
    
    return mapped;
  }

  async findBySlug(slug: string): Promise<ProductType | null> {
    const cacheKey = `product:slug:${slug}`;
    const cached = await this.cacheManager.get<ProductType>(cacheKey);
    if (cached) {
      console.log('[Cache HIT] findBySlug:', slug);
      return cached;
    }

    console.log('[Cache MISS] findBySlug:', slug);
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) return null;

    const mapped = mapProduct(product);
    await this.cacheManager.set(cacheKey, mapped, 300);
    
    return mapped;
  }

  async findByCategory(category: string): Promise<ProductType[]> {
    const cacheKey = `products:category:${category}`;
    const cached = await this.cacheManager.get<ProductType[]>(cacheKey);
    if (cached) {
      console.log('[Cache HIT] findByCategory:', category);
      return cached;
    }

    console.log('[Cache MISS] findByCategory:', category);
    const products = await prisma.product.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    const mapped = products.map(mapProduct);
    await this.cacheManager.set(cacheKey, mapped, 300);
    
    return mapped;
  }

  /**
   * Crea un producto con validación Zod manual
   * Decision: Validamos aquí en lugar de usar @UsePipes porque
   * los pipes de NestJS no funcionan bien con GraphQL inputs
   */
  async create(data: any): Promise<any> {
    // Validación manual con Zod
    const validationResult = CreateProductSchema.safeParse(data);
    
    if (!validationResult.success) {
      // ✅ DESPUÉS (Zod v4)
const errorMessages = validationResult.error.issues.map((err) => ({
  field: err.path.join('.'),
  message: err.message,
}));

      throw new BadRequestException({
        message: 'Error de validación',
        errors: errorMessages,
      });
    }

    // Generar slug único
    const baseSlug = data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Verificar si el slug ya existe y agregar sufijo si es necesario
    let slug = baseSlug;
    let counter = 1;
    let existingProduct = await prisma.product.findUnique({ where: { slug } });
    
    while (existingProduct) {
      slug = `${baseSlug}-${counter}`;
      existingProduct = await prisma.product.findUnique({ where: { slug } });
      counter++;
    }

    const product = await prisma.product.create({
      data: {
        ...validationResult.data,
        slug,
      },
    });

    await this.invalidateCache();
    
    return product;
  }

  async update(id: string, data: any): Promise<any> {
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    await this.invalidateCache();
    
    return product;
  }

  async updateStatus(id: string, isActive: boolean): Promise<ProductType> {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { isActive },
      });

      await this.invalidateCache();
      
      return mapProduct(updatedProduct);
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async findRelated(category: string, excludeId: string, limit: number = 4): Promise<ProductType[]> {
    const cacheKey = `products:related:${category}:exclude:${excludeId}:limit:${limit}`;
    const cached = await this.cacheManager.get<ProductType[]>(cacheKey);
    if (cached) {
      console.log('[Cache HIT] findRelated');
      return cached;
    }

    console.log('[Cache MISS] findRelated');
    const products = await prisma.product.findMany({
      where: {
        category,
        isActive: true,
        id: { not: excludeId },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    const mapped = products.map(mapProduct);
    await this.cacheManager.set(cacheKey, mapped, 300);
    
    return mapped;
  }

  async remove(id: string): Promise<any> {
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    await this.invalidateCache();
    
    return product;
  }

  async delete(id: string): Promise<any> {
    const product = await prisma.product.delete({
      where: { id },
    });

    await this.invalidateCache();
    
    return product;
  }

  private async invalidateCache(): Promise<void> {
    console.log('[Cache] Invalidating all product caches');
await this.cacheManager.clear();
  }
}