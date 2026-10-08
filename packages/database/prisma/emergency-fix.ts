import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Picsum Photos - SIEMPRE funciona, cada seed es una imagen diferente
const fallbackImages: Record<string, string> = {
  'WHISKY': 'https://picsum.photos/seed/whisky1/800/600',
  'RON': 'https://picsum.photos/seed/ron1/800/600',
  'TEQUILA': 'https://picsum.photos/seed/tequila1/800/600',
  'MEZCAL': 'https://picsum.photos/seed/mezcal1/800/600',
  'GIN': 'https://picsum.photos/seed/gin1/800/600',
  'VODKA': 'https://picsum.photos/seed/vodka1/800/600',
  'LICOR': 'https://picsum.photos/seed/licor1/800/600',
  'VERMOUTH': 'https://picsum.photos/seed/vermouth1/800/600',
  'VINOS ESPUMOSOS': 'https://picsum.photos/seed/espumoso1/800/600',
  'VINO': 'https://picsum.photos/seed/vino1/800/600',
  'PREMEZCLADO': 'https://picsum.photos/seed/premezclado1/800/600',
};

async function main() {
  console.log('🚨 Emergency fix with Picsum Photos...');

  for (const [category, imageUrl] of Object.entries(fallbackImages)) {
    const result = await prisma.product.updateMany({
      where: { category },
      data: { imageUrl },
    });

    console.log(`✅ ${category}: ${result.count} products updated`);
  }

  console.log('🎉 Emergency fix complete!');
}

main()
  .catch((e) => {
    console.error('❌ Fix failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });