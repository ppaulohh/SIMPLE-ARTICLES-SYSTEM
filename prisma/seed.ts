// prisma/seed.ts

// Importações do Prisma 7.x para o Seed:
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Importação necessária para hashear a senha
import * as bcrypt from 'bcrypt'; 

// --- Configuração do Prisma Client para o Seed (com Adaptador) ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter: adapter,
});
// -----------------------------------------------------------------


async function main() {
  console.log(`\n=================================================`);
  console.log(`  🚀 Iniciando Seed...`);
  console.log(`=================================================\n`);

  // --- 1. Criar Permissões (Roles) ---
  console.log(`Criando Permissões...`);
  
  const roles = [
    { name: 'ADMIN', description: 'Permissão total e acesso administrativo' },
    { name: 'EDITOR', description: 'Pode criar, editar e publicar artigos' },
    { name: 'READER', description: 'Pode apenas ler artigos publicados' },
  ];

  await prisma.permission.createMany({
      data: roles,
      skipDuplicates: true,
  });

  // Obter o ID da permissão ADMIN
  const adminRole = await prisma.permission.findUnique({
      where: { name: 'ADMIN' },
  });
  
  if (!adminRole) {
      console.error('Erro: Permissão ADMIN não encontrada após o seed.');
      return;
  }
  
  // --- 2. Criar Usuário Admin Padrão para Teste ---
  const adminEmail = 'admin@teste.com';
  const rawPassword = 'admin123456'; // Senha para teste
  
  // ⚠️ Hasheando a senha antes de salvar
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  
  console.log(`\nCriando Usuário Admin: ${adminEmail} (Senha: ${rawPassword})`);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      permissionId: adminRole.id,
    },
    create: {
      email: adminEmail,
      name: 'Admin Master',
      password: hashedPassword,
      permissionId: adminRole.id,
    },
  });

  console.log(`\nSeed concluído com sucesso!`);
  console.log(`=================================================\n`);
}

main()
  .catch((e) => {
    console.error(`Falha no Seed:`, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });