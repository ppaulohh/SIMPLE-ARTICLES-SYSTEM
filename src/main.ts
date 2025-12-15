// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configuração global do ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      transform: true, 
      forbidNonWhitelisted: true, 
      errorHttpStatusCode: 400, 
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Simple Articles System API')
    .setDescription('Documentação da API do sistema de artigos construído com NestJS e Prisma.')
    .setVersion('1.0')
    
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'access-token', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();