import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gws.com';
  const password = 'admin123';
  
  console.log('🔐 Generando hash para:', email);
  
  // Generar hash real
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('✅ Hash generado:', hashedPassword);
  
  // Verificar que el hash funciona
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('✅ Hash válido:', isValid);
  
  // Actualizar el usuario existente
  const updated = await prisma.user.update({
    where: { email },
    data: { passwordHash: hashedPassword },
  });
  
  console.log('\n✅ Usuario actualizado:');
  console.log('   Email:', updated.email);
  console.log('   Role:', updated.role);
  console.log('   Hash starts with:', updated.passwordHash.substring(0, 10));
  
  // Verificar que ahora sí funciona el login
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const loginWorks = await bcrypt.compare(password, user.passwordHash);
    console.log('\n🔑 Test de login:', loginWorks ? '✅ FUNCIONA' : '❌ FALLA');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });