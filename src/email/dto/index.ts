import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';
import { ObjectId } from 'mongoose';

export class BodyDataType {
  @ApiProperty()
  @IsString()
  readonly userId: ObjectId | string;

  @ApiProperty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsDate()
  readonly expire: Date;
}
