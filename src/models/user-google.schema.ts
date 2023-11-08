import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentUserGoogle = UserGoogle & Document;

@Schema({ timestamps: true })
export class UserGoogle extends Document {
  @Prop({ index: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  avatar: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserGoogleSchema = SchemaFactory.createForClass(UserGoogle);
