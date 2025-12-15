import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// O tipo de payload que esperamos do nosso token
export type JwtPayload = {
  email: string;
  sub: number;
  permission: string; // Nível de permissão (Admin, Editor, Reader)
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // 1. Extrai o token do cabeçalho 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. CORREÇÃO: Usamos '!' para garantir que o TypeScript não veja 'undefined'.
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
      // 3. Ignora se o token tiver expirado (false = valida expiração)
      ignoreExpiration: false,
    });
  }

  // Esta função é chamada após o token ser validado (assinado corretamente)
  // O payload é o objeto decodificado do token (JwtPayload)
  async validate(payload: JwtPayload) {
    // O retorno deste método será injetado no objeto 'request.user'
    return { 
      userId: payload.sub, 
      email: payload.email, 
      permission: payload.permission 
    };
  }
}