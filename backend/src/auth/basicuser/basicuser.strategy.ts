import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/entities/user/entities/user.entity';

@Injectable()
export class BasicUserStrategy extends PassportStrategy(Strategy, 'basicuser') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user: User = await this.authService.validateUser({
      username: username,
      password: password
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}