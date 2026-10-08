import { Controller, Post, Get, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PrismaClient } from '@prisma/client';
import * as Papa from 'papaparse';

const prisma = new PrismaClient();

interface CsvProduct {
  name: string;
  brand: string;
  category: string;
  description?: string;
  presentation: string;
  alcoholicDegree: string;
  price: string;
  currency?: string;
  stock: string;
  country?: string;
  region?: string;
  grape?: string;
  vintage?: string;
  score?: string;
  pairing?: string;
  imageUrl?: string;
  tastingNotes?: string;
}

@Controller('products-import')
export class ProductsImportController {
  @Post('import')
  @UseGuards(GqlAuthGuard)
  async importProducts(@Body() body: { csvData: string }) {
    const results = Papa.parse<CsvProduct>(body.csvData, {
      header: true,
      skipEmptyLines: true,
    });

    const imported = [];
    const errors = [];

    for (let i = 0; i < results.data.length; i++) {
      const row = results.data[i];
      const rowIndex = i + 2; // +2 porque fila 1 es header y Papa cuenta desde 0

      try {
        // Validaciones
        if (!row.name || !row.brand || !row.category || !row.presentation) {
          errors.push({ row: rowIndex, error: 'Faltan campos obligatorios (name, brand, category, presentation)' });
          continue;
        }

        // Generar slug
        const slug = row.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Parsear notas de cata
        const tastingNotes = row.tastingNotes
          ? row.tastingNotes.split(',').map(n => n.trim()).filter(Boolean)
          : [];

        const product = await prisma.product.create({
          data: {
            name: row.name.trim(),
            slug,
            brand: row.brand.trim(),
            category: row.category.trim().toUpperCase(),
            description: row.description?.trim() || null,
            presentation: row.presentation.trim(),
            alcoholicDegree: parseFloat(row.alcoholicDegree) || 0,
            price: parseFloat(row.price) || 0,
            currency: row.currency?.trim() || 'MXN',
            stock: parseInt(row.stock) || 0,
            country: row.country?.trim() || null,
            region: row.region?.trim() || null,
            grape: row.grape?.trim() || null,
            vintage: row.vintage ? parseInt(row.vintage) : null,
            score: row.score ? parseFloat(row.score) : null,
            pairing: row.pairing?.trim() || null,
            imageUrl: row.imageUrl?.trim() || null,
            tastingNotes,
            isActive: true,
          },
        });

        imported.push({ row: rowIndex, name: product.name, id: product.id });
      } catch (error: any) {
        errors.push({ row: rowIndex, error: error.message });
      }
    }

    return {
      success: true,
      imported: imported.length,
      errors: errors.length,
      details: { imported, errors },
    };
  }

  @Get('export')
  @UseGuards(GqlAuthGuard)
  async exportProducts(@Res() res: Response) {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const csvData = products.map(p => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      description: p.description || '',
      presentation: p.presentation,
      alcoholicDegree: p.alcoholicDegree,
      price: p.price,
      currency: p.currency,
      stock: p.stock,
      country: p.country || '',
      region: p.region || '',
      grape: p.grape || '',
      vintage: p.vintage || '',
      score: p.score || '',
      pairing: p.pairing || '',
      imageUrl: p.imageUrl || '',
      tastingNotes: (p.tastingNotes || []).join(', '),
    }));

    const csv = Papa.unparse(csvData);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=productos-gws.csv');
    res.send('\ufeff' + csv); // BOM para Excel
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const template = [
      {
        name: 'Ejemplo Whisky',
        brand: 'Johnnie Walker',
        category: 'WHISKY',
        description: 'Whisky escocés premium con notas ahumadas',
        presentation: '750 ml',
        alcoholicDegree: '40',
        price: '899.99',
        currency: 'MXN',
        stock: '50',
        country: 'Escocia',
        region: 'Highlands',
        grape: '',
        vintage: '',
        score: '92',
        pairing: 'Carnes rojas, quesos maduros',
        imageUrl: 'https://ejemplo.com/imagen.jpg',
        tastingNotes: 'ahumado, vainilla, roble, frutas secas',
      },
    ];

    const csv = Papa.unparse(template);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=plantilla-productos.csv');
    res.send('\ufeff' + csv);
  }
}