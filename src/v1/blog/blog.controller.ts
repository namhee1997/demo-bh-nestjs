import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from '@src/models/blog.schema';
import {
  BodyDataBlogType,
  ReqDataBlogType,
  ResDataBlogType,
} from './dto/index.';

@Controller('blog')
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiResponse({
    status: 200,
    isArray: true,
    type: ResDataBlogType,
  })
  async getAllBlog(): Promise<Blog[]> {
    const getAllBlog = await this.blogService.getAllBlogService();
    return getAllBlog;
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    type: ResDataBlogType,
  })
  async getBlogById(@Param('id') id: string): Promise<Blog> {
    const getAllBlog = await this.blogService.findById(id);
    return getAllBlog;
  }

  @Post()
  @ApiResponse({
    status: 201,
    type: ResDataBlogType,
  })
  async createBlog(@Body() blogBody: BodyDataBlogType): Promise<Blog> {
    const blog = await this.blogService.createBlogService(blogBody);
    return blog;
  }

  @Patch()
  @ApiResponse({
    status: 201,
    type: ResDataBlogType,
  })
  async updateBlog(@Body() blogBody: ReqDataBlogType): Promise<Blog> {
    const getAllBlog = await this.blogService.updateBlogService(blogBody);
    return getAllBlog;
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    type: 'string',
  })
  async deleteBlogById(@Param('id') id: string): Promise<string> {
    await this.blogService.deleteBlogService(id);
    return 'ok';
  }
}
