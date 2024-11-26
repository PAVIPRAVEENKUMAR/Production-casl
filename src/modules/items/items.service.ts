import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateItemDto } from './dto/Create-item.dto'; 
import { UpdateItemDto } from './dto/Update-item.dto';
import { Item, ItemDocument } from './schema/items.schema';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  async create(createItemDto: CreateItemDto, userId: string): Promise<Item> {
    const newItem = new this.itemModel({ ...createItemDto, owner: userId });
    return newItem.save();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  
  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto, userId: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    if (item.owner !== userId) {
      throw new NotFoundException('You do not own this item');
    }
    Object.assign(item, updateItemDto);
    return item.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    if (item.owner !== userId) {
      throw new NotFoundException('You do not own this item');
    }
    await this.itemModel.deleteOne({ _id: id }).exec();
  }
}