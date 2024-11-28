import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateItemDto {

  @ApiProperty({ description: 'Name of the item', required: false })
  @IsString()
  @IsOptional()
  name!: string;

  @ApiProperty({ description: 'Description of the item', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}