import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, DocumentUser } from 'src/models/user.schema';
import { BodyDataUserType } from './dto/index.';
import { EmailService } from 'src/email';
import appConfig from 'src/config';
import { TokenResetPasswordService } from 'src/email/service';
import { PasswordResetToken } from 'src/models/password-reset-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<DocumentUser>,
    private readonly emailService: EmailService,
    private readonly tokenResetService: TokenResetPasswordService,
  ) {}

  async createUserService(user: User): Promise<User> {
    try {
      const newProduct = new this.userModel(user);
      const savedUser = await newProduct.save();
      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.hashed_password;

      return userWithoutPassword;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(
    email: string,
    getPassword?: boolean,
  ): Promise<User | null> {
    try {
      const query = this.userModel.findOne({ email });
      if (!getPassword) query.select('-hashed_password');

      return query.exec();
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUserService(): Promise<User[]> {
    try {
      const users = await this.userModel
        .find()
        .select('-hashed_password')
        .exec();

      return users;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getByIdService(id: string): Promise<User> {
    try {
      const users = await this.userModel
        .findById(id)
        .select('-hashed_password')
        .exec();
      return users;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserService(product: BodyDataUserType): Promise<User> {
    try {
      const email = await this.findByEmail(product.email);
      if (email) throw new Error('Email already exists!');
      const users = await this.userModel.findByIdAndUpdate(
        product._id,
        { $set: product },
        {
          new: true,
          select: '-hashed_password',
        },
      );
      return users;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUserService(id: string): Promise<void> {
    try {
      await this.userModel.findByIdAndRemove(id);
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendMailWellCome(user: User): Promise<boolean> {
    try {
      const htmlContent = await this.emailService.loadWellComeTemplate(
        user.fullname,
      );

      await this.emailService.sendEmail(
        'namvv.bhsoft@gmail.com',
        'WellCome',
        htmlContent,
      );

      return true;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendMailConfirmResetPassword(user: User): Promise<boolean> {
    try {
      const generate = uuidv4();
      const currentTime = new Date();
      currentTime.setMinutes(
        currentTime.getMinutes() + appConfig.EXPIRES_IN_RESET_PASSWORD_MINUTES,
      );

      const newToken = await this.tokenResetService.createTokenResetPassword({
        userId: user._id,
        code: generate,
        expire: currentTime,
        status: 'pending',
      } as PasswordResetToken);

      const htmlContent =
        await this.emailService.loadEmailTemplateResetPassword(
          user.fullname,
          'Reset Password',
          `${appConfig.client}/reset-password/${newToken.code}`,
        );

      await this.emailService.sendEmail(
        'namvv.bhsoft@gmail.com',
        'Reset Password',
        htmlContent,
      );

      return true;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserPasswordService({
    newPassword,
    userId,
  }: {
    newPassword: string;
    userId: string;
  }): Promise<User> {
    try {
      const users = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: { hashed_password: newPassword } },
        {
          new: true,
          select: '-hashed_password',
        },
      );

      return users;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
