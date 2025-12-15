import { SetMetadata } from '@nestjs/common';

// Chave que o RolesGuard irá procurar
export const ROLES_KEY = 'roles';

/**
 * Decorator para definir as permissões necessárias para acessar uma rota.
 * @param roles - Nomes das permissões permitidas (ex: 'Admin', 'Editor').
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);