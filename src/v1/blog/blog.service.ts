import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BodyDataBlogType, ReqDataBlogType } from './dto/index.';
import { Blog, DocumentBlog } from 'src/models/blog.schema';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<DocumentBlog>) {}

  async createBlogService(blog: BodyDataBlogType): Promise<Blog> {
    try {
      const newBLog = new this.blogModel(blog);
      const savedBlog = await newBLog.save();

      return savedBlog;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: ObjectId | string): Promise<Blog | null> {
    try {
      const query = this.blogModel.findById(id);

      return query.exec();
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllBlogService(): Promise<Blog[]> {
    try {
      const users = await this.blogModel.find().exec();

      return users;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBlogService(dataBlog: ReqDataBlogType): Promise<Blog> {
    try {
      const blog = await this.findById(dataBlog._id);
      if (!blog) throw new Error('Blog is empty!');
      const users = await this.blogModel.findByIdAndUpdate(
        blog._id,
        { $set: dataBlog },
        {
          new: true,
        },
      );
      return users;
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBlogService(id: string): Promise<void> {
    try {
      await this.blogModel.findByIdAndRemove(id);
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
