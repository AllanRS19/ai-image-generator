import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  issueToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }
}
