

import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';
import { IsBoolean, IsOptional } from 'class-validator'; 

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
    
    @ApiProperty({
        description: 'Status de publicação do artigo',
        example: true,
        required: false,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean({ message: 'O status de publicação deve ser um valor booleano.' })
    isPublished?: boolean; 
}