import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs 100% estables - Picsum Photos siempre funciona
// Cada seed genera una imagen única y consistente
const categoryImages: Record<string, string> = {
  'WHISKY': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80',
  'RON': 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80',
  'TEQUILA': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80',
  'MEZCAL': 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?w=800&q=80',
  'GIN': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
  'VODKA': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80',
  'LICOR': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80',
  'VERMOUTH': 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80',
  'VINOS ESPUMOSOS': 'https://images.unsplash.com/photo-1594916383637-8a0b1f0c0b1f?w=800&q=80',
  'VINO': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
  'PREMEZCLADO': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
};

async function main() {
  console.log('🔧 Fixing ALL product images with stable URLs...');

  for (const [category, imageUrl] of Object.entries(categoryImages)) {
    const result = await prisma.product.updateMany({
      where: { category },
      data: { imageUrl },
    });

    console.log(`✅ ${category}: ${result.count} products updated`);
  }

  console.log('🎉 All product images fixed with stable URLs!');
}

main()
  .catch((e) => {
    console.error('❌ Fix failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });