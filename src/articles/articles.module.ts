import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from '../schemas/article.schema';
import { AbilityFactory } from '../abilities/ability.factory';

@Module({
  imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])],
  controllers: [ArticlesController],
  providers: [ArticlesService, AbilityFactory],
  exports: [ArticlesService],
})
export class ArticlesModule {}