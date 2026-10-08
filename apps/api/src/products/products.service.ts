import { Injectable } from '@nestjs/common';
import { PrismaClient, Product as PrismaProduct } from '@prisma/client';
import { ProductType } from './dto/product.dto';

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
    images: product.images || [],  // ← NUEVO
    tastingNotes: product.tastingNotes || [],
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

@Injectable()
export class ProductsService {
  async findAll(): Promise<ProductType[]> {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return products.map(mapProduct);
  }

  async findOne(id: string): Promise<ProductType | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product ? mapProduct(product) : null;
  }

  async findBySlug(slug: string): Promise<ProductType | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    return product ? mapProduct(product) : null;
  }

  async findByCategory(category: string): Promise<ProductType[]> {
    const products = await prisma.product.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
    return products.map(mapProduct);
  }
    // Crear producto
  async create(data: any): Promise<any> {
    return prisma.product.create({
      data: {
        ...data,
        slug: data.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      },
    });
  }

  // Actualizar producto
  async update(id: string, data: any): Promise<any> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

async findRelated(category: string, excludeId: string, limit: number = 4): Promise<ProductType[]> {
  const products = await prisma.product.findMany({
    where: {
      category,
      isActive: true,
      id: { not: excludeId },
    },
    take: limit,
    orderBy: { name: 'asc' },
  });
  return products.map(mapProduct);
}

  // Eliminar producto (soft delete)
  async remove(id: string): Promise<any> {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Eliminar permanentemente
  async delete(id: string): Promise<any> {
    return prisma.product.delete({
      where: { id },
    });
  }
}