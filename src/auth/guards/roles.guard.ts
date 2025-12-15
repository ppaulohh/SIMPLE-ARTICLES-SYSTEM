import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
// Importamos o tipo do payload para ter acesso à propriedade 'permission'
import { JwtPayload } from '../jwt.strategy'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega as permissões exigidas pela rota (metadados do @Roles())
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // Verifica o método
      context.getClass(),   // Verifica o Controller
    ]);

    // Se a rota não tem @Roles() definido, o acesso é permitido (após o AuthGuard)
    if (!requiredRoles) {
      return true; 
    }

    // 2. Pega o objeto do usuário (o payload do JWT) que foi injetado pelo AuthGuard
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user; 
    
    if (!user) {
        // Isso não deve acontecer se o JwtAuthGuard rodar primeiro, mas é uma segurança.
        return false;
    }

    // 3. Verifica se a permissão do usuário logado (user.permission) está inclusa 
    // na lista de permissões requeridas (requiredRoles).
    return requiredRoles.some((role) => user.permission === role);
  }
}