import appConfig from '@src/config';

export const isValidEmail = (email: string) => {
  return appConfig.REGEX_EMAIL.test(email);
};

export const generateRandomPassword = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

export function isImage(file: Express.Multer.File): boolean {
  const fileExtension = (file.originalname || '')
    .toLowerCase()
    .substring(file.originalname.lastIndexOf('.'));

  if (appConfig.allowedExtensions.includes(fileExtension)) return true;

  return false;
}
