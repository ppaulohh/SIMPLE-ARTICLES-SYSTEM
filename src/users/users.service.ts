// src/users/users.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  // Constante para o custo do hashing
  private readonly saltRounds = 10;

  async findByEmailWithPermission(email: string) {
    // MANTIDO: Ótimo método para autenticação
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        permission: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Um usuário com este email já está cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);

    const readerPermission = await this.prisma.permission.findUnique({
      where: { name: 'READER' }
    });

    if (!readerPermission) {
      throw new NotFoundException('Permissão padrão "READER" não encontrada. Execute o seed.');
    }

    // === CORREÇÃO 1: Método create ===
    // Desestrutura o DTO e constrói o objeto de dados de forma explícita.
    // Isso garante que apenas campos conhecidos pelo Prisma (name, email) sejam passados,
    // junto com os valores injetados (password, permissionId).
    const { name, email } = createUserDto;

    return this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword, // Valor hasheado injetado
        permissionId: readerPermission.id, // Valor de regra de negócio injetado
      },
      // Seleção de retorno (MANTIDO)
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        permission: { select: { name: true } }
      },
    });
  }

  // MANTIDO: Ótimo uso de Omit<User, 'password'>
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        permissionId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // MANTIDO: Método findOne é robusto
  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        permissionId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user as Omit<User, 'password'>;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 1. Verifica se o usuário existe antes de tentar atualizar
    await this.findOne(id);

    let hashedPassword: string | undefined = undefined;
    let permissionId: number | undefined = undefined;

    if (updateUserDto.password) {
      // Hash da nova senha
      hashedPassword = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }

    // 2. Lógica para buscar nova permissão (MANTIDA)
    if (updateUserDto.permissionName) {
      const permission = await this.prisma.permission.findUnique({
        where: { name: updateUserDto.permissionName }
      });
      if (!permission) {
        throw new NotFoundException(`Permissão "${updateUserDto.permissionName}" não encontrada.`);
      }
      permissionId = permission.id;
    }

    // === CORREÇÃO 2: Método update (Reforçando a segurança e limpando o código) ===
    // Desestrutura o DTO para separar o campo "virtual" (permissionName)
    const { permissionName, password, ...restOfUpdateDto } = updateUserDto;

    // 3. Constrói o objeto de dados final para o Prisma
    const prismaUpdateData = {
      ...restOfUpdateDto, // name, email, etc.
      // Sobrescreve a senha (se hasheada)
      password: hashedPassword,
      // Adiciona o ID da permissão (se encontrada)
      permissionId: permissionId,
    };

    // Remove campos que são undefined (e o Prisma não aceita)
    Object.keys(prismaUpdateData).forEach(key =>
      (prismaUpdateData[key] === undefined) && delete prismaUpdateData[key]
    );

    return this.prisma.user.update({
      where: { id },
      data: prismaUpdateData, // Passa o objeto literal limpo
      select: {
        id: true,
        name: true,
        email: true,
        permissionId: true,
        updatedAt: true,
        permission: { select: { name: true } }
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: { id: true, email: true },
    });
  }
}