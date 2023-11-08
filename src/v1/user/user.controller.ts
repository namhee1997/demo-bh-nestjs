import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResBodyDataUserType } from '../auth/dto';
import { BodyDataUserType } from './dto/index.';
import { User } from '@src/models/user.schema';

@Controller('user')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    isArray: true,
    type: ResBodyDataUserType,
  })
  async getAllUser(): Promise<User[]> {
    const getAllUser = await this.userService.getAllUserService();
    return getAllUser;
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    type: ResBodyDataUserType,
  })
  async getUserById(@Param('id') id: string): Promise<User> {
    const getAllUser = await this.userService.getByIdService(id);
    return getAllUser;
  }

  @Patch()
  @ApiResponse({
    status: 201,
    type: BodyDataUserType,
  })
  async updateUser(@Body() userBody: BodyDataUserType): Promise<User> {
    const getAllUser = await this.userService.updateUserService(userBody);
    return getAllUser;
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    type: 'string',
  })
  async deleteUserById(@Param('id') id: string): Promise<string> {
    await this.userService.deleteUserService(id);
    return 'ok';
  }
}
