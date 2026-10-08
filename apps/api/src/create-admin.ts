import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gws.com';
  const password = 'admin123';
  
  // Generar hash fresco
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('🔐 Hash generado:', hashedPassword);

  // Verificar que el hash funciona
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('✅ Hash válido:', isValid);

  // Crear o actualizar el usuario
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
      firstName: 'Administrador',
      lastName: 'GWS',
    },
    create: {
      email,
      passwordHash: hashedPassword,
      role: 'ADMIN',
      firstName: 'Administrador',
      lastName: 'GWS',
    },
  });

  console.log('\n✅ Admin user ready:');
  console.log('   Email:', admin.email);
  console.log('   Password:', password);
  console.log('   Role:', admin.role);
  console.log('   Hash starts with:', admin.passwordHash.substring(0, 10));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });