import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Institution } from 'src/entities/institution/entities/institution.entity';
import { InstitutionLoginDto } from './insitutionlogin.dto';

@Injectable()
export class InstitutionStrategy extends PassportStrategy(Strategy, 'institution') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(data: InstitutionLoginDto): Promise<Institution> {
    const institution: Institution = await this.authService.validateInstitution(data);
    if (!institution) throw new UnauthorizedException();
    return institution;
  }
}