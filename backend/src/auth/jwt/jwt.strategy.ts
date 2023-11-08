import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWTRequestContent } from './jwt.request';

const cookieExtractor = req => {
  let jwt = null 
  if (req && req.cookies) {
      jwt = req.cookies['accessToken']
  }
  return jwt
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: JWTRequestContent): Promise<JWTRequestContent> {
    return payload;
  }
}