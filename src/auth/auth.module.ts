import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigModule e ConfigService
import { AuthController } from './auth.controller'; 
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module'; // Importa o módulo de usuários (dependência do AuthService)
import { JwtStrategy } from './jwt.strategy'; // Importa a Strategy

@Module({
  imports: [
    // 1. Módulo de Usuários (necessário para validar as credenciais no AuthService)
    UsersModule, 
    // 2. Passport (para integrar a Strategy)
    PassportModule,
    // 3. JWT Module (configurado assincronamente para usar o JWT_SECRET do .env)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' }, 
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}