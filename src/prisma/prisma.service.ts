// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Cria a Pool usando a variável de ambiente injetada pelo Docker
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    // 2. Cria o Adaptador
    const adapter = new PrismaPg(pool);

    // 3. Inicializa o Prisma Client com o adaptador
    super({
      adapter: adapter,
      // log: ['query'], // Opcional
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}