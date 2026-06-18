import { Controller, Get, Post, Body, Query, Req, UnauthorizedException } from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtService } from '@nestjs/jwt';

@Controller('grades')
export class GradesController {
  constructor(
    private readonly gradesService: GradesService,
    private readonly jwtService: JwtService
  ) {}

  @Get('info')
  async getInfo(@Req() request: any) {
    const payload = this.checkAuth(request);
    return this.gradesService.getTeacherInfo(payload.sub);
  }

  @Get('journal')
  async getJournal(
    @Query('groupId') groupId: string,
    @Query('subjectId') subjectId: string,
    @Req() request: any
  ) {
    this.checkAuth(request);
    return this.gradesService.getJournal(Number(groupId), Number(subjectId));
  }

  @Get('my')
  async getMyGrades(@Req() request: any) {
    const payload = this.checkAuth(request);
    if (payload.role !== 'STUDENT') {
      throw new UnauthorizedException();
    }
    return this.gradesService.getStudentGrades(payload.sub);
  }

  @Post('update')
  async updateGrade(
    @Body('studentId') studentId: number,
    @Body('scheduleId') scheduleId: number,
    @Body('action') action: string,
    @Body('value') value: string,
    @Req() request: any
  ) {
    const payload = this.checkAuth(request);
    if (payload.role !== 'TEACHER') {
      throw new UnauthorizedException();
    }
    return this.gradesService.updateGrade(studentId, scheduleId, action, value);
  }

  @Post('lesson')
  async addLesson(
    @Body('groupId') groupId: number,
    @Body('subjectId') subjectId: number,
    @Body('date') date: string,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Req() request: any
  ) {
    const payload = this.checkAuth(request);
    if (payload.role !== 'TEACHER') {
      throw new UnauthorizedException();
    }
    return this.gradesService.addLesson(payload.sub, Number(groupId), Number(subjectId), date, startTime, endTime);
  }

  private checkAuth(request: any): any {
    const token = request.cookies['jwt'];
    if (!token || token === 'undefined') throw new UnauthorizedException();
    try {
      const payload = this.jwtService.decode(token);
      if (!payload) throw new UnauthorizedException();
      return payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}