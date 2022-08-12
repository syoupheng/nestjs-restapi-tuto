import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Patch('me')
  async editCurrentUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return await this.userService.editUser(userId, dto);
  }
}
