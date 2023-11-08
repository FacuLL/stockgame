import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/entities/user/entities/user.entity';

@Injectable()
export class InstitutionStrategy extends PassportStrategy(Strategy, 'institution') {
  constructor(private authService: AuthService) {
    super({usernameField: 'email', passwordField:'password'});
  }

  async validate(email: string, password: string): Promise<User> {
    const user: User = await this.authService.validateInstitution({
      email: email,
      password: password
    });
    if (user) return user;
    throw new UnauthorizedException();
  }
}