import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user): Promise<{ message: string }> {
    const existingUser = await this.userService.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    await this.userService.create(user);
    return { message: 'User registered successfully' };
  }
}
