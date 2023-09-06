import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Institution } from 'src/entities/institution/entities/institution.entity';

@Injectable()
export class InstitutionStrategy extends PassportStrategy(Strategy, 'institution') {
  constructor(private authService: AuthService) {
    super({usernameField: 'email', passwordField:'password'});
  }

  async validate(email: string, password: string): Promise<Institution> {
    const institution: Institution = await this.authService.validateInstitution({
      email: email,
      password: password
    });
    if (!institution) throw new UnauthorizedException();
    return institution;
  }
}