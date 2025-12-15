import { PartialType, ApiProperty } from '@nestjs/swagger'; 
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @ApiProperty({
        description: "Permissão do usuário (exclusivo para admins)",
        example: 'Editor',
        enum: ['Admin', 'Editor', 'Reader'],
        required: false,
    })
    @IsString({ message: 'A permissão deve ser uma string válida.' })
    @IsOptional()
    permissionName?: string;
}