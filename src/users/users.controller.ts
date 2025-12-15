import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards, 
  ParseIntPipe,
  HttpStatus 
} from '@nestjs/common';

// Módulos da Aplicação
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 
import { RolesGuard } from 'src/auth/guards/roles.guard'; 
import { Roles } from 'src/auth/decorators/roles.decorator'; 
import { Public } from 'src/auth/decorators/public.decorator'; // << NOVO IMPORT

// Importações do Swagger
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Users') // Tag principal para agrupar endpoints
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Guards aplicados em todas as rotas, exceto onde anulados
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -----------------------------------------------------------
  // POST /users (Registro/Criação) - Rota Pública
  // -----------------------------------------------------------
  @Post()
  @Public()
  @ApiOperation({ summary: 'Cria um novo usuário (Registro público)' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Usuário registrado com sucesso.' 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados de registro inválidos.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // -----------------------------------------------------------
  // GET /users (Buscar Todos) - Requer Autenticação e Permissão
  // -----------------------------------------------------------
  @Roles('ADMIN', 'EDITOR')
  @Get()
  @ApiBearerAuth('access-token') // Indica que a rota requer token JWT
  @ApiOperation({ summary: 'Lista todos os usuários (Acesso restrito: Admin/Editor)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuários retornada.'
    // type: [UserEntity] 
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Token não fornecido ou inválido.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Permissão insuficiente para acessar o recurso.' })
  findAll() {
    return this.usersService.findAll();
  }

  // -----------------------------------------------------------
  // GET /users/:id (Buscar Um) - Requer Autenticação
  // -----------------------------------------------------------
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Busca um usuário por ID (Requer autenticação)' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário a ser buscado', 
    type: Number 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário encontrado.' 
    // type: UserEntity 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // -----------------------------------------------------------
  // PATCH /users/:id (Atualizar) - Requer Autenticação e Admin
  // -----------------------------------------------------------
  @Roles('ADMIN')
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualiza um usuário por ID (Acesso restrito: Admin)' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário a ser atualizado', 
    type: Number 
  })
  @ApiBody({ 
    type: UpdateUserDto,
    description: 'Dados a serem atualizados (opcionais)',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário atualizado com sucesso.' 
    // type: UserEntity 
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Permissão insuficiente.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // -----------------------------------------------------------
  // DELETE /users/:id (Remover) - Requer Autenticação e Admin
  // -----------------------------------------------------------
  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove um usuário por ID (Acesso restrito: Admin)' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário a ser removido', 
    type: Number 
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Permissão insuficiente.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}