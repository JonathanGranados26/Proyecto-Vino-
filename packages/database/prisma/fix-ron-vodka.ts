import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs alternativas verificadas que SÍ funcionan
const fixedImages: Record<string, string> = {
  'RON': 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80&auto=format&fit=crop',
  'VODKA': 'https://images.unsplash.com/photo-1610444583489-99e1b7b6b0a3?w=800&q=80&auto=format&fit=crop',
};

async function main() {
  console.log(' Fixing RON and VODKA images...');

  for (const [category, imageUrl] of Object.entries(fixedImages)) {
    const result = await prisma.product.updateMany({
      where: { category },
      data: { imageUrl },
    });

    console.log(`✅ ${category}: ${result.count} products updated`);
  }

  console.log(' RON and VODKA images fixed!');
}

main()
  .catch((e) => {
    console.error('❌ Fix failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });