import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ItemModule } from './modules/items/items.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports:[
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI ||'fallback-mongo-uri'),
    AuthModule,
    UsersModule,
    ItemModule,
  ],
})
export class AppModule {}