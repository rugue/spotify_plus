import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstants } from './auth.constants';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 1.
      ignoreExpiration: false, // 2.
      secretOrKey: authConstants.secret, // 3.
    });
  }
  async validate(payload: any) {
    // 4.
    return { userId: payload.sub, email: payload.email }; // 5.
  }
}
