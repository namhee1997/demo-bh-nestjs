import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type DocumentBlog = Blog & Document;

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  content: string;

  @Prop({
    type: String,
    required: true,
    ref: User.name,
    index: true,
  })
  author: string;

  @Prop([String])
  tags: string[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
