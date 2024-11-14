import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true })
  authorId!: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);