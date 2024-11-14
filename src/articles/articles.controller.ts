import { Controller,Req,  Get, Post, Put, Delete, Param, Body, ForbiddenException,UsePipes, ValidationPipe} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AbilityFactory, Action } from '../abilities/ability.factory';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from '../schemas/article.schema';
import { AuthenticatedRequest} from './types';
import { User } from '../schemas/article.schema';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly abilityFactory: AbilityFactory
  ) {}

  @Get()
  async getAllArticles(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    const ability = this.abilityFactory.defineAbilityFor(user);
    if (ability.can(Action.Read, Article)) {
      return this.articlesService.findAll();
    }
    throw new ForbiddenException('Access denied');
  }

  @Get(':id')
  async getArticleById(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createArticle(@Body() createArticleDto: CreateArticleDto,@Req() req:AuthenticatedRequest, @Body() body) {
    const user = req.user;
    const ability = this.abilityFactory.defineAbilityFor(user);
    if (ability.can(Action.Create,Article)) {
      return this.articlesService.create(createArticleDto, user.id);
    }
    throw new ForbiddenException('Access denied');
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateArticle(@Param('id') id: string,@Body() updateArticleDto: UpdateArticleDto,
  @Req() req:AuthenticatedRequest,):Promise<Article>{
    const user = req.user;
    const ability = this.abilityFactory.defineAbilityFor(req.user);
    if (ability.can(Action.Update, Article)) {
      return this.articlesService.update(id, updateArticleDto);
    }
    throw new ForbiddenException('Access denied');
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: string, @Req() req:AuthenticatedRequest): Promise<Article> {
    const ability = this.abilityFactory.defineAbilityFor(req.user);
    if (ability.can(Action.Delete, Article)) {
      return this.articlesService.delete(id);
    }
    throw new ForbiddenException('Access denied');
  }
}