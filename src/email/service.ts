import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PasswordResetToken,
  DocumentPasswordReset,
} from 'src/models/password-reset-token.schema';
import { BodyDataType } from './dto';

@Injectable()
export class TokenResetPasswordService {
  constructor(
    @InjectModel(PasswordResetToken.name)
    private tokenModel: Model<DocumentPasswordReset>,
  ) {}

  async createTokenResetPassword(
    data: PasswordResetToken,
  ): Promise<PasswordResetToken> {
    try {
      const newToken = new this.tokenModel(data);
      return newToken.save();
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }

  async findTokenResetPassword(
    code: string,
  ): Promise<PasswordResetToken | null> {
    try {
      const query = this.tokenModel.findOne({ code });

      return query.exec();
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }

  async updateTokenService(
    data: BodyDataType & { status: string },
  ): Promise<PasswordResetToken> {
    try {
      const token = await this.tokenModel.findOneAndUpdate(
        { code: data.code },
        {
          $set: data,
        },
        {
          new: true,
        },
      );

      return token;
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }

  async deleteUserService(id: string): Promise<void> {
    try {
      await this.tokenModel.findByIdAndRemove(id);
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }
}
