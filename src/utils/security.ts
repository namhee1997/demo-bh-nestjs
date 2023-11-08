import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { User } from '@src/models/user.schema';
import appConfig from '@src/config';

@Injectable()
export class SecurityService {
  constructor() {}

  async getPasswordHash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, appConfig.SALT_ROUNDS);
    return hashedPassword;
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  }

  async createToken(payload: object, expire?: string): Promise<string> {
    const token = await jwt.sign(payload, appConfig.SECRET_KEY, {
      expiresIn: expire || appConfig.APP_ACCESS_TOKEN_EXPIRE_MINUTES,
    });
    return token;
  }

  async verifyToken<T>(
    token: string,
    algorithm?: string,
  ): Promise<T & Omit<User, 'hashed_password'>> {
    try {
      if (token.startsWith('Bearer ')) token = token.split('Bearer ')[1];

      const payload = jwt.verify(token, appConfig.SECRET_KEY, {
        algorithms: [
          (algorithm as jwt.Algorithm) ||
            (appConfig.ALGORITHM as jwt.Algorithm),
        ],
      }) as T & User & { exp: number };

      if (!payload) throw new Error('Invalid token.');

      const currentTimestamp = Math.floor(Date.now());
      if (payload.exp * 1000 < currentTimestamp)
        throw new Error('Token is valid and not expired.');

      return payload;
    } catch (error) {
      const { message } = error as Error;
      throw new Error(message);
    }
  }
}
