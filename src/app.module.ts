import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './mongoose/config';
import { RouterModule } from '@nestjs/core';
import { V1Module } from './v1/v1.module';
import { TokenMiddleware } from './middleware/token';
import { SecurityService } from './utils/security';
import { User, UserSchema } from './models/user.schema';
import { UserService } from './v1/user/user.service';
import { EmailService } from './email';
import {
  PasswordResetToken,
  PasswordResetTokenSchema,
} from './models/password-reset-token.schema';
import { TokenResetPasswordService } from './email/service';
import { UserGoogleSchema, UserGoogle } from './models/user-google.schema';
import { UserGoogledService } from './google/service';
import { Blog, BlogSchema } from './models/blog.schema';
import { BlogService } from './v1/blog/blog.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryProvider } from './cloudinary/config/cloudinary.provider';

const router = [
  {
    path: 'api/v1',
    module: V1Module,
  },
];

@Module({
  imports: [
    RouterModule.register(router),
    MongooseModule.forRootAsync({
      useFactory: () => mongooseConfig,
    }),
    V1Module,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
      { name: UserGoogle.name, schema: UserGoogleSchema },
    ]),
  ],
  controllers: [],
  providers: [
    UserService,
    BlogService,
    SecurityService,
    EmailService,
    TokenResetPasswordService,
    UserGoogledService,
    CloudinaryService,
    CloudinaryProvider,
  ],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .forRoutes({ path: '*/user*', method: RequestMethod.ALL });

    consumer
      .apply(TokenMiddleware)
      .forRoutes({ path: '*/auth/refresh_token', method: RequestMethod.ALL });
  }
}
