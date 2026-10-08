import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs verificadas de Unsplash (estas sí funcionan)
const categoryImages: Record<string, string> = {
  'WHISKY': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80&auto=format&fit=crop',
  'RON': 'https://images.unsplash.com/photo-1614313517677-46061e58e6f1?w=800&q=80&auto=format&fit=crop',
  'TEQUILA': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80&auto=format&fit=crop',
  'MEZCAL': 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?w=800&q=80&auto=format&fit=crop',
  'GIN': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80&auto=format&fit=crop',
  'VODKA': 'https://images.unsplash.com/photo-1610444583489-99e1b7b6b0a3?w=800&q=80&auto=format&fit=crop',
  'LICOR': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80&auto=format&fit=crop',
  'VERMOUTH': 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80&auto=format&fit=crop',
  'VINOS ESPUMOSOS': 'https://images.unsplash.com/photo-1594916383637-8a0b1f0c0b1f?w=800&q=80&auto=format&fit=crop',
  'VINO': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80&auto=format&fit=crop',
  'PREMEZCLADO': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&auto=format&fit=crop',
};

async function main() {
  console.log('🔧 Fixing product images with verified URLs...');

  for (const [category, imageUrl] of Object.entries(categoryImages)) {
    const result = await prisma.product.updateMany({
      where: { category },
      data: { imageUrl },
    });

    console.log(`✅ ${category}: ${result.count} products updated`);
  }

  console.log('🎉 All product images fixed!');
}

main()
  .catch((e) => {
    console.error('❌ Fix failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });