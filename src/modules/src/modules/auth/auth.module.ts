import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from '../users/auth.service';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ClaimsService } from '../authz/claims.service';
import { RolesModule } from '../roles/roles.module';


@Module({
  imports: [forwardRef(()=>UsersModule),PassportModule.register({ defaultStrategy: 'jwt' }),RolesModule],
  controllers: [UsersController],
  providers: [AuthService,JwtStrategy,ClaimsService],
  exports: [AuthService],
})
export class AuthModule {}