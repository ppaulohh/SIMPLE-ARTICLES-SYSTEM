// src/articles/articles.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { Article } from '@prisma/client'; 

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // ====================================================================
  // 1. CREATE
  // ====================================================================
  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    
    const author = await this.prisma.user.findUnique({
      where: { id: createArticleDto.authorId },
    });

    if (!author) {
      throw new NotFoundException(`Autor com ID ${createArticleDto.authorId} não encontrado.`);
    }

    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content,
        isPublished: createArticleDto.isPublished ?? false,
        authorId: createArticleDto.authorId,  
      },
    });
  }

  // ====================================================================
  // 2. READ (ALL)
  // ====================================================================
  /**
   * Retorna todos os artigos. Por padrão, apenas artigos publicados são retornados.
   * @param published - Opcional. Se for 'true' ou 'false', filtra o status.
   */
  async findAll(published?: boolean): Promise<Article[]> {
    const whereCondition = typeof published === 'boolean' ? { isPublished: published } : { isPublished: true };
    
    return this.prisma.article.findMany({
      where: whereCondition,
      // Inclui o nome do autor na listagem
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      // Ordena do mais novo para o mais antigo
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }
  
  // ====================================================================
  // 3. READ (ONE)
  // ====================================================================
  async findOne(id: number): Promise<Article> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Artigo com ID ${id} não encontrado.`);
    }
    
    // Regra de Negócio: Se o artigo não está publicado, não deve ser acessível
    // ao público geral (a menos que seja um admin/editor, o que é checado no Controller/Guard).
    // Aqui, retornamos ele de qualquer forma, e o Controller lida com a autorização.
    
    return article;
  }
  
  // ====================================================================
  // 4. UPDATE
  // ====================================================================
  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    // Verifica se o artigo existe antes de tentar atualizar
    await this.findOne(id); 

    // O Prisma automaticamente ignora campos indefinidos em updateArticleDto
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }
  
  // ====================================================================
  // 5. DELETE
  // ====================================================================
  async remove(id: number): Promise<{ id: number; title: string }> {
    // Verifica se o artigo existe antes de tentar deletar
    const articleToDelete = await this.findOne(id); 

    await this.prisma.article.delete({
      where: { id },
    });
    
    // Retorna uma confirmação
    return { id: articleToDelete.id, title: articleToDelete.title };
  }
}