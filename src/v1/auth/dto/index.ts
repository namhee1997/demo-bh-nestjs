import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ReqTokenDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}

export class ReqRefreshTokenDto {
  @ApiProperty()
  @IsString()
  readonly refresh_token: string;
}

export class TokenTypes {
  @ApiProperty()
  @IsString()
  readonly access_token: string;

  @ApiProperty()
  @IsString()
  readonly refresh_token: string;

  @ApiProperty()
  @IsString()
  readonly token_type: string;
}

export class RequestBodyDataUserType {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly date_of_birth?: string;

  @ApiProperty()
  @IsString()
  readonly phone: string;

  @ApiProperty()
  @IsString()
  readonly fullname: string;

  @ApiProperty({ type: String, format: 'binary', required: true })
  avatar: any;

  @ApiProperty()
  @IsString()
  readonly address: string;
}

export class ResBodyDataUserType {
  @ApiProperty()
  @IsEmail()
  readonly _id: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly date_of_birth: string;

  @ApiProperty()
  @IsString()
  readonly phone: string;

  @ApiProperty()
  @IsString()
  readonly fullname: string;

  @ApiProperty()
  readonly avatar: string;

  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class NewPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
