import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type DocumentPasswordReset = PasswordResetToken & Document;

@Schema({ timestamps: true })
export class PasswordResetToken extends Document {
  @Prop({ required: true, index: true })
  code: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Date, required: true, default: Date.now, expires: 3600 })
  expire: Date;

  @Prop({ type: String, required: true, ref: User.name })
  userId: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PasswordResetTokenSchema =
  SchemaFactory.createForClass(PasswordResetToken);
