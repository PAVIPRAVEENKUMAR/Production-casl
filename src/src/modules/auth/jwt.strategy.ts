import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth/jwt.payload';
import { Role } from '../roles/roles.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('Validating JWT Payload:', payload);

    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    return { userId: payload.sub, email: payload.email, role: Role };
  }
}
