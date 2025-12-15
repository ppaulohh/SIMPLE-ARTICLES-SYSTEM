// src/auth/dto/auth-login.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhaSenhaSegura123',
    minLength: 8,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}