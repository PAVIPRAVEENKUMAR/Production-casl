import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isActivated = (await super.canActivate(context)) as boolean;
    if (!isActivated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    console.log('JwtAuthGuard - User in Request:', request.user);
    const authHeader = request.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User information is missing in token');
    }

    console.log('Decoded User from Token:', user);
    return true;
  }
}