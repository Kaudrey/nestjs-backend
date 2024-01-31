import { Controller, Post, Body, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import {User} from './user.schema'


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user): Promise<{ message: string }> {
    try {
      const existingUser = await this.userService.findByEmail(user.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Create a new user with the hashed password
      await this.userService.create({
        ...user,
        password: hashedPassword,
      } as User);

      return { message: 'User registered successfully' };
    } catch (error) {
      // Handle other potential errors
      throw new ConflictException('Error registering user');
    }
  }

  @Post('login')
  async login(@Body() credentials): Promise<{ message: string }> {
    try {
      const user = await this.userService.findByEmail(credentials.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Perform authentication logic (check password)
      const isPasswordValid = await this.comparePasswords(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return { message: 'User logged in successfully' };
    } catch (error) {
      // Handle other potential errors
      throw new UnauthorizedException('Error during login');
    }
  }

  private async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
