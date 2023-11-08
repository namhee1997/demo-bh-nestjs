import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGoogle, DocumentUserGoogle } from 'src/models/user-google.schema';
import { ReqDataUserGoogleType, UserGoogleType } from './dto';
import { OAuth2Client } from 'google-auth-library';
import appConfig from 'src/config';

const client = new OAuth2Client();

@Injectable()
export class UserGoogledService {
  constructor(
    @InjectModel(UserGoogle.name)
    private userGoogleModel: Model<DocumentUserGoogle>,
  ) {}

  async createUserGoogle(data: ReqDataUserGoogleType): Promise<UserGoogle> {
    try {
      const newUser = new this.userGoogleModel(data);
      return newUser.save();
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }

  async findUserGoogle(email: string): Promise<UserGoogle | null> {
    try {
      const query = this.userGoogleModel.findOne({ email });

      return query.exec();
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }

  async deleteUserService(id: string): Promise<void> {
    try {
      await this.userGoogleModel.findByIdAndRemove(id);
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }

  async verifyIdToken(token: string): Promise<UserGoogleType> {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: appConfig.CLIENT_ID,
      });
      return ticket.getPayload() as UserGoogleType;
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }
}
