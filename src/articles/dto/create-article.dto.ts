// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsString, 
    IsInt, 
    MaxLength, 
    IsOptional, 
    IsBoolean 
} from 'class-validator';

export class CreateArticleDto {
    
    @ApiProperty({
        description: 'Título do artigo (obrigatório)',
        example: 'Como configurar o Docker para NestJS',
        maxLength: 255,
    })
    @IsString({ message: 'O título deve ser uma string válida.' })
    @IsNotEmpty({ message: 'O título é obrigatório.' })
    @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres.' })
    title: string;

    @ApiProperty({
        description: 'Conteúdo completo do artigo',
        example: 'Este artigo detalha os passos para configurar um projeto...',
        required: true,
    })
    @IsString({ message: 'O conteúdo deve ser uma string válida.' })
    @IsNotEmpty({ message: 'O conteúdo é obrigatório.' })
    content: string;

    @ApiProperty({
        description: 'Define se o artigo deve ser publicado imediatamente.',
        example: false,
        required: false, // É opcional
        default: false,
    })
    @IsBoolean({ message: 'O status de publicação deve ser um valor booleano.' })
    @IsOptional()
    isPublished?: boolean = false; 

    @ApiProperty({
        description: 'ID do usuário criador do artigo sera obtido pelo token JWT)',
        example: 1,
        required: true,
    })
    @IsInt({ message: 'O ID do autor deve ser um número inteiro.' })
    @IsOptional()
    authorId: number; 
}