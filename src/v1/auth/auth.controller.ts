import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  ReqTokenDto,
  NewPasswordDto,
  ReqRefreshTokenDto,
  RequestBodyDataUserType,
  ResBodyDataUserType,
  TokenTypes,
} from './dto';
import { AuthService } from './auth.service';
import { Token } from '@src/domain/response-type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDataGoogle } from '@src/google/dto';
import { User } from '@src/models/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiResponse({
    status: 201,
    type: TokenTypes,
  })
  async getToken(@Body() userReq: ReqTokenDto): Promise<TokenTypes> {
    const { access_token, refresh_token } =
      await this.authService.getTokenService(userReq);
    const data = new Token({ access_token, refresh_token });
    return data;
  }

  @Post('refresh_token')
  @ApiResponse({
    status: 201,
    type: TokenTypes,
  })
  @ApiBearerAuth()
  async getRefreshToken(@Body() body: ReqRefreshTokenDto): Promise<TokenTypes> {
    const { access_token, refresh_token } =
      await this.authService.refreshTokenService(body.refresh_token);
    const data = new Token({ access_token, refresh_token });
    return data;
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBody({
    type: RequestBodyDataUserType,
  })
  @ApiResponse({
    status: 201,
    type: ResBodyDataUserType,
  })
  @Post('register')
  async register(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() userBody: RequestBodyDataUserType,
  ): Promise<User> {
    const user = await this.authService.registerService(userBody, avatar);
    return user;
  }

  @Post('forgot-password')
  @ApiResponse({
    status: 201,
    type: Boolean,
  })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<boolean> {
    const password = await this.authService.forgotPasswordService(body.email);
    return password;
  }

  @Post('new-password')
  @ApiResponse({
    status: 201,
    type: Boolean,
  })
  async newPassword(@Body() body: NewPasswordDto): Promise<boolean> {
    const password = await this.authService.newPasswordService(body);
    return password;
  }

  @Get('google/token')
  @ApiResponse({
    status: 201,
    type: ResponseDataGoogle,
  })
  async loginGoogleToken(
    @Query('id_token') id_token: string,
  ): Promise<ResponseDataGoogle> {
    const data = await this.authService.googleService(id_token);
    return data;
  }
}
