import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs de imágenes por categoría
const categoryImages: Record<string, string> = {
  'WHISKY': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80',
  'RON': 'https://images.unsplash.com/photo-1614313517677-46061e58e6f1?w=800&q=80',
  'TEQUILA': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80',
  'MEZCAL': 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?w=800&q=80',
  'GIN': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
  'VODKA': 'https://images.unsplash.com/photo-1610444583489-99e1b7b6b0a3?w=800&q=80',
  'LICOR': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80',
  'VERMOUTH': 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80',
  'VINOS ESPUMOSOS': 'https://images.unsplash.com/photo-1594916383637-8a0b1f0c0b1f?w=800&q=80',
  'VINO': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
  'PREMEZCLADO': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
};

async function main() {
  console.log('🎨 Updating product images...');

  for (const [category, imageUrl] of Object.entries(categoryImages)) {
    const result = await prisma.product.updateMany({
      where: { category },
      data: { imageUrl },
    });

    console.log(`✅ ${category}: ${result.count} products updated`);
  }

  console.log('🎉 All product images updated successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Update failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });