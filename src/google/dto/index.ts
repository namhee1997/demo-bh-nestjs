import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber } from 'class-validator';

export class ReqDataUserGoogleType {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;

  @ApiProperty()
  @IsString()
  readonly role: string;

  @ApiProperty()
  readonly createdAt?: Date;

  @ApiProperty()
  readonly updatedAt?: Date;
}

export class UserGoogleType {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly given_name: string;

  @ApiProperty()
  @IsString()
  readonly family_name: string;

  @ApiProperty()
  @IsString()
  readonly picture: string;

  @ApiProperty()
  @IsNumber()
  readonly exp: number;
}

export class ResDataUserGoogleType {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;

  @ApiProperty()
  @IsString()
  readonly role: string;

  @ApiProperty()
  readonly createdAt?: Date;

  @ApiProperty()
  readonly updatedAt?: Date;
}

export class ResponseDataGoogle {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: ResDataUserGoogleType;
}
