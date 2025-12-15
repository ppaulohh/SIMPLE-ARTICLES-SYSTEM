// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto'; 

// 1. Importar as decorações do Swagger
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Auth') // Define o grupo/tag 'Auth' para este controlador
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticação do usuário (Login)' })
  
  // 2. Documentar a requisição Body (opcional, mas bom para garantir)
  @ApiBody({ 
    type: AuthLoginDto, 
    description: 'Credenciais de login (email e senha)',
  })
  
  // 3. Documentar as respostas (sucesso e erro)
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Login bem-sucedido. Retorna o token de acesso.',
    // type: AuthTokenEntity // Se você tiver um DTO para o objeto de retorno (ex: { access_token: string })
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Credenciais inválidas.' })
  login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }
}