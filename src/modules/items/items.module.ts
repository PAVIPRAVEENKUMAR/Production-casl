import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { ItemSchema } from './schema/items.schema';
import { ItemsController } from './items.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ClaimsService } from '../authz/claims.service';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';


@Module({
  imports: [RolesModule,UsersModule,MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),JwtModule.register({
    secret: 'yourJwtSecretKey', 
    signOptions: { expiresIn: '24hr' }, 
  }),AuthModule],
  controllers: [ItemsController],
  providers: [ItemsService,ClaimsService]
})
export class ItemModule {}