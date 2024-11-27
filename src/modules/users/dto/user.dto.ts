import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean, MinLength,
  IsEnum
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  username!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @IsOptional()
  role?: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class Login {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  password!: string;
}

