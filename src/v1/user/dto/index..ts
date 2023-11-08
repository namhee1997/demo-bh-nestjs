import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class BodyDataUserType {
  @ApiProperty()
  @IsString()
  readonly _id: ObjectId;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly date_of_birth: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly fullname: string;

  @IsOptional()
  readonly avatar: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiPropertyOptional()
  @IsIn(['admin', 'user'])
  @IsOptional()
  readonly role: 'admin' | 'user';
}
