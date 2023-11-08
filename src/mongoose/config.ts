import { MongooseModuleOptions } from '@nestjs/mongoose';
import appConfig from '@src/config';

export const mongooseConfig: MongooseModuleOptions = {
  uri: appConfig.MONGODB_URL,
  connectionFactory: (connection) => {
    connection.on('connected', () => {
      console.log('Mongoose is connected');
    });
    connection._events.connected();
    return connection;
  },
};
