// prisma.config.ts
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  
  // Seção para o `npx prisma migrate deploy`
  datasource: {
    url: env("DATABASE_URL"),
  },
  
  // Seção para o `npx prisma db seed` (Corrigida conforme o log)
  migrations: {
    path: "prisma/migrations",
    
    // NOVO: Adicione o comando de seed aqui
    seed: 'ts-node prisma/seed.ts', 
  },
});