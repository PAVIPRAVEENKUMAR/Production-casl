import { forwardRef, Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/users.schema';
import { UsersController } from './users.controller'; 
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { ClaimsService } from '../authz/claims.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),forwardRef(() => AuthModule),RolesModule
  ],
  controllers: [UsersController],
  providers: [UsersService,ClaimsService],
  exports: [UsersService],  
})
export class UsersModule {}