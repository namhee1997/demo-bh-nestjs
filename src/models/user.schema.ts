import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentUser = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  hashed_password: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  date_of_birth: string;

  @Prop()
  phone: string;

  @Prop()
  fullname: string;

  @Prop()
  avatar: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
