import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    MinLength,
    MaxLength 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    
    @ApiProperty({
        description: 'Nome completo do usuário',
        example: 'João da Silva',
        minLength: 3,
        required: true,
    })
    @IsString({ message: 'O nome deve ser uma string válida.' })
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    name: string;

    @ApiProperty({
        description: 'Email do usuário (deve ser único)',
        example: 'joao.silva@email.com',
        required: true,
    })
    @IsEmail({}, { message: 'O email deve ser um formato válido.' })
    @IsNotEmpty({ message: 'O email é obrigatório.' })
    email: string;

    @ApiProperty({
        description: 'Senha do usuário',
        example: 'Senha1234',
        minLength: 6,
        maxLength: 30,
        required: true,
    })
    @IsString({ message: 'A senha deve ser uma string válida.' })
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
    @MaxLength(30, { message: 'A senha deve ter no máximo 30 caracteres.' })
    password: string;

    // A permissão é definida no Service como 'Reader' por padrão, 
}