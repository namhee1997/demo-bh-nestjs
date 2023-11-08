import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.schema';
import { ReqTokenDto, NewPasswordDto, RequestBodyDataUserType } from './dto';
import { SecurityService } from 'src/utils/security';
import { UserService } from '../user/user.service';
import { TokenResetPasswordService } from 'src/email/service';
import { UserGoogledService } from 'src/google/service';
import { ResponseDataGoogle } from 'src/google/dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { isImage, isValidEmail } from 'src/utils';
import appConfig from 'src/config';
import { DataToken } from 'src/domain/schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly securityService: SecurityService,
    private readonly resetPasswordService: TokenResetPasswordService,
    private readonly userGoogledService: UserGoogledService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getTokenService(
    userReq: ReqTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const getUser = (await this.userService.findByEmail(
        userReq.email,
        true,
      )) as User | null;
      if (!getUser) throw new Error('Incorrect username or password');

      const hashedPassword = await this.securityService.verifyPassword(
        userReq.password,
        getUser.hashed_password,
      );
      if (!hashedPassword) throw new Error('Incorrect username or password');

      const dataToken = {
        _id: getUser._id,
        email: getUser.email,
        fullname: getUser.fullname,
        role: getUser.role,
      };

      const getToken = await this.securityService.createToken(dataToken);

      const getRefreshToken = await this.securityService.createToken(
        {
          ...dataToken,
          is_refresh_token: true,
        },
        appConfig.APP_REFRESH_TOKEN_EXPIRE_DAYS,
      );

      return { access_token: getToken, refresh_token: getRefreshToken };
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  async registerService(
    userBody: RequestBodyDataUserType,
    avatar: Express.Multer.File,
  ): Promise<User> {
    try {
      if (!isValidEmail(userBody.email)) throw new Error('Email invalidate.');

      const findEmail = await this.userService.findByEmail(userBody.email);

      if (findEmail) throw new Error('Email already exist.');

      const hashed_password = await this.securityService.getPasswordHash(
        userBody.password,
      );

      if (!isImage(avatar)) throw new Error('Avatar must be an image!');

      const avatarUrl = await this.cloudinaryService.uploadImage(avatar);

      const dataCreateUser = {
        avatar: avatarUrl.url,
        hashed_password,
        email: userBody.email,
        date_of_birth: userBody.date_of_birth,
        phone: userBody.phone,
        fullname: userBody.fullname,
        address: userBody.address,
        role: 'user',
      } as User;

      const user = await this.userService.createUserService(dataCreateUser);

      await this.userService.sendMailWellCome(user);

      return user;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  async forgotPasswordService(email: string): Promise<boolean> {
    try {
      const findEmail = await this.userService.findByEmail(email);

      if (!findEmail) throw new Error('User not found');

      const send =
        await this.userService.sendMailConfirmResetPassword(findEmail);
      return send;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  async newPasswordService({
    code,
    password: passWord,
  }: NewPasswordDto): Promise<boolean> {
    try {
      if (!code || !passWord) throw new Error('code and password is required!');

      const codeField =
        await this.resetPasswordService.findTokenResetPassword(code);

      const currentTime = new Date();

      if (codeField.status === 'changed') throw new Error('You have updated!');

      if (codeField.expire <= currentTime)
        throw new Error('Password refresh time has expired!');

      const user = await this.userService.getByIdService(codeField.userId);

      const hashed_password =
        await this.securityService.getPasswordHash(passWord);

      await this.userService.updateUserPasswordService({
        newPassword: hashed_password,
        userId: user._id,
      });

      await this.resetPasswordService.updateTokenService({
        code: codeField.code,
        expire: codeField.expire,
        userId: codeField.userId,
        status: 'changed',
      });

      return true;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  async googleService(id_token: string): Promise<ResponseDataGoogle> {
    try {
      if (!id_token) throw new Error('Token is empty!');

      const dataUserGoogle =
        await this.userGoogledService.verifyIdToken(id_token);

      if (!dataUserGoogle) throw new Error('User not found');

      const userGoogle = await this.userGoogledService.findUserGoogle(
        dataUserGoogle.email,
      );

      if (userGoogle) {
        const user = {
          id: userGoogle._id,
          email: userGoogle.email,
          lastName: userGoogle.lastName,
          firstName: userGoogle.firstName,
          role: userGoogle.role,
          avatar: userGoogle.avatar || '',
        };
        const getToken = await this.securityService.createToken(user);
        return {
          access_token: getToken,
          user: user,
        };
      }

      const user = {
        email: dataUserGoogle.email,
        lastName: dataUserGoogle.family_name,
        firstName: dataUserGoogle.given_name,
        role: 'user',
        avatar: dataUserGoogle.picture || '',
      };
      const newUser = await this.userGoogledService.createUserGoogle(user);
      const getToken = await this.securityService.createToken({
        ...user,
        id: newUser._id,
      });
      return {
        access_token: getToken,
        user: {
          ...user,
          id: newUser._id,
        },
      };
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshTokenService(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const decodedToken = (await this.securityService.verifyToken(
        refresh_token,
      )) as DataToken;
      if (!decodedToken.is_refresh_token)
        throw new Error('Please enter a valid refresh token');

      const getUser = (await this.userService.findByEmail(
        decodedToken.email,
        true,
      )) as User | null;

      const dataToken = {
        _id: getUser._id,
        email: getUser.email,
        fullname: getUser.fullname,
        role: getUser.role,
      };

      if (!dataToken._id && !dataToken.email)
        throw new Error(
          'Refresh token is not associated with the current user',
        );

      const getToken = await this.securityService.createToken(dataToken);

      const getRefreshToken = await this.securityService.createToken(
        {
          ...dataToken,
          is_refresh_token: true,
        },
        appConfig.APP_REFRESH_TOKEN_EXPIRE_DAYS,
      );

      return { access_token: getToken, refresh_token: getRefreshToken };
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
