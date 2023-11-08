import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class BodyDataBlogType {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @ApiProperty()
  @IsOptional()
  readonly tags: string[];
}

export class ReqDataBlogType extends BodyDataBlogType {
  @ApiProperty()
  @IsString()
  readonly _id: ObjectId;
}

export class ResDataBlogType extends BodyDataBlogType {
  @ApiProperty()
  @IsString()
  readonly _id: ObjectId;

  @IsOptional()
  readonly createdAt: Date;

  @IsOptional()
  readonly updatedAt: Date;
}
