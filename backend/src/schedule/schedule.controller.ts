import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  async getSchedule(@Req() request: any) {
    const token = request.cookies['jwt'];
    if (!token) throw new UnauthorizedException('Не авторизован');
    
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET || 'secret' });
      
      if (payload.role === 'STUDENT') {
        return await this.scheduleService.getStudentSchedule(payload.sub);
      } else if (payload.role === 'TEACHER') {
        return await this.scheduleService.getTeacherSchedule(payload.sub);
      }
    } catch (e) {
      throw new UnauthorizedException('Недействительный токен');
    }
    
    return [];
  }
}