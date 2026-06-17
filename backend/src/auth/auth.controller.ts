import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any, @Res({ passthrough: true }) res: Response) {
    const result: any = await this.authService.login(loginDto);
    
    res.cookie('jwt', result.access_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      role: result.user.role,
      access_token: result.access_token
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Выполнен выход' };
  }

  @Get('seed')
  seedUsers() {
    return this.authService.seedUsers();
  }
}