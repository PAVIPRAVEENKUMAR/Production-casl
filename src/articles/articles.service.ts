import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto} from './dto/update-article.dto';


@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findById(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article>{
    const newArticle = new this.articleModel(createArticleDto);
    return newArticle.save();
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article | null> {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Article | null> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }
}