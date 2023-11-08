import * as dotenv from 'dotenv';
dotenv.config();

const appConfig: Record<string, any> = {
  MONGODB_URL: process.env.MONGODB_URL || '',
  SECRET_KEY: process.env.SECRET_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  REGEX_EMAIL:
    /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|yahoo\.com|outlook\.com|example\.com)$/,
  APP_ACCESS_TOKEN_EXPIRE_MINUTES:
    process.env.APP_ACCESS_TOKEN_EXPIRE_MINUTES || '30m', // 30 minutes,
  APP_REFRESH_TOKEN_EXPIRE_DAYS:
    process.env.APP_REFRESH_TOKEN_EXPIRE_DAYS || '10d', // 10 day,
  ALGORITHM: 'HS256',
  SALT_ROUNDS: 10,
  port: process.env.PORT || 8081,
  client: process.env.CLIENT_URL || `http://localhost:3000`,
  EXPIRES_IN_RESET_PASSWORD_MINUTES: 30,
  CLIENT_ID: process.env.CLIENT_ID || '',
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  allowedExtensions: ['.jpg', '.jpeg', '.png'],
};

export default appConfig;
