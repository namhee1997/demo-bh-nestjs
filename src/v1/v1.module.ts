import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@src/models/user.schema';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { SecurityService } from '@src/utils/security';
import { EmailService } from '@src/email';
import {
  PasswordResetToken,
  PasswordResetTokenSchema,
} from '@src/models/password-reset-token.schema';
import { TokenResetPasswordService } from '@src/email/service';
import { UserGoogle, UserGoogleSchema } from '@src/models/user-google.schema';
import { UserGoogledService } from '@src/google/service';
import { Blog, BlogSchema } from '@src/models/blog.schema';
import { BlogService } from './blog/blog.service';
import { BlogController } from './blog/blog.controller';
import { CloudinaryService } from '@src/cloudinary/cloudinary.service';
import { CloudinaryProvider } from '@src/cloudinary/config/cloudinary.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
      { name: UserGoogle.name, schema: UserGoogleSchema },
    ]),
  ],
  providers: [
    UserService,
    BlogService,
    AuthService,
    SecurityService,
    EmailService,
    TokenResetPasswordService,
    UserGoogledService,
    CloudinaryService,
    CloudinaryProvider,
  ],
  exports: [CloudinaryService, CloudinaryProvider],
  controllers: [UserController, AuthController, BlogController],
})
export class V1Module {}
