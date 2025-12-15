import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  ParseIntPipe // << NOVO IMPORT: Para garantir que o :id seja um número
} from '@nestjs/common';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  // ====================================================================
  // POST /articles (Criação - Requer Editor ou Admin)
  // Nota: A lógica de injeção de authorId foi mantida.
  // ====================================================================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cria um novo artigo (Requer Editor/Admin)' })
  @ApiResponse({ status: 201, description: 'Artigo criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiForbiddenResponse({ description: 'Acesso negado. Permissão insuficiente (403).' })

  create(
    @Body() createDto: CreateArticleDto,
    @Request() req,
  ) {
    const authorId = req.user.userId;

    // Sobrescreve o campo com o ID seguro do token
    createDto.authorId = authorId;

    return this.articlesService.create(createDto);
  }

  // ====================================================================
  // GET /articles (Listagem - Público/Admin)
  // ====================================================================
  @Get()
  @ApiOperation({
    summary: 'Lista artigos. Por padrão, lista apenas publicados.',
    description: 'Use `?published=false` para ver rascunhos (requer Admin ou Editor).'
  })
  @ApiResponse({ status: 200, description: 'Retorna a lista de artigos.' })
  @ApiQuery({
    name: 'published',
    required: false,
    type: Boolean,
    description: 'Filtra por artigos publicados (true/false). Se omitido, retorna apenas publicados.'
  })

  findAll(@Query('published') published?: string) {

    let publishedFilter: boolean | undefined = undefined;

    // Converte a string da query para boolean se for 'true' ou 'false'
    if (published === 'true') {
      publishedFilter = true;
    } else if (published === 'false') {
      publishedFilter = false;
    }

    return this.articlesService.findAll(publishedFilter);
  }

  // ====================================================================
  // GET /articles/:id (Busca por ID - Público)
  // ====================================================================
  @Get(':id')
  @ApiOperation({ summary: 'Busca um artigo por ID (Público)' })
  @ApiParam({ name: 'id', description: 'ID do artigo a ser buscado', type: Number })
  @ApiResponse({ status: 200, description: 'Retorna o artigo encontrado.' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado.' })

  // <<<< CORREÇÃO AQUI: Usa ParseIntPipe e define o tipo como number
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findOne(id);
  }

  // ====================================================================
  // PATCH /articles/:id (Atualização - Requer Editor ou Admin)
  // ====================================================================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualiza parcialmente um artigo por ID (Requer Editor/Admin)' })
  @ApiParam({ name: 'id', description: 'ID do artigo a ser atualizado', type: Number })
  @ApiResponse({ status: 200, description: 'Artigo atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado.' })
  @ApiForbiddenResponse({ description: 'Acesso negado. Permissão insuficiente (403).' })

  update(
    // <<<< CORREÇÃO AQUI: Usa ParseIntPipe e define o tipo como number
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  // ====================================================================
  // DELETE /articles/:id (Remoção - Requer Admin)
  // ====================================================================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove um artigo por ID (Requer Admin)' })
  @ApiParam({ name: 'id', description: 'ID do artigo a ser removido', type: Number })
  @ApiResponse({ status: 200, description: 'Artigo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado.' })
  @ApiForbiddenResponse({ description: 'Acesso negado. Permissão insuficiente (403).' })

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}