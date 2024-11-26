import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClaimsService } from './claims.service';
import { defineAbilityFor} from './casl-ability.factory';

@Injectable()
export abstract class CaslBaseGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly claimsService: ClaimsService,
  ) {}

protected abstract getModuleName(): string;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('CaslBaseGuard - User:', user);

    if (!user){
      throw new UnauthorizedException('User is not authenticated.');
    }
    console.log('Authenticating user:', user);
    const claims = await this.claimsService.getClaimsForUser(user);
    
    const ability= defineAbilityFor(claims);
    const handler = context.getHandler();
    const Action = this.reflector.get<string>('action', handler);
    const Subject = this.reflector.get<string>('subject', handler);

    if (!Action || !Subject) {
      return true;
    }
    if (!ability.can(Action, Subject)) {
      throw new ForbiddenException('You do not have permission');
    }
    return true;
  }
}