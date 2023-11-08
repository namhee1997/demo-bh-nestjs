import { v2 as cloudinary } from 'cloudinary';
import appConfig from 'src/config';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: appConfig.CLOUDINARY_NAME,
      api_key: appConfig.CLOUDINARY_API_KEY,
      api_secret: appConfig.CLOUDINARY_API_SECRET,
    });
  },
};
