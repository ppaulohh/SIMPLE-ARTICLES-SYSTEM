import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service'; 
import { AuthLoginDto } from './dto/auth-login.dto'; 


import { User } from '@prisma/client'; 

type UserWithoutPassword = Omit<User, 'password'> & { 
    permission: { name: string } 
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserWithoutPassword> {
    

    const user = await this.usersService.findByEmailWithPermission(email);

    if (!user) {
        throw new UnauthorizedException('Credenciais inválidas.');
    }


    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas.');
    }

    const { password, ...result } = user; 
    return result as UserWithoutPassword;
  }


  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto.email, authLoginDto.password);

    const payload = { 
      email: user.email, 
      sub: user.id, 
      permission: user.permission.name 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}