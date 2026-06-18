import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async getStudentSchedule(studentId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!user || !user.groupId) return [];

    return this.prisma.schedule.findMany({
      where: { groupId: user.groupId },
      include: { subject: true, teacher: true },
      orderBy: { date: 'asc' },
    });
  }

  async getTeacherSchedule(teacherId: number) {
    return this.prisma.schedule.findMany({
      where: { teacherId: teacherId },
      include: { subject: true, group: true },
      orderBy: { date: 'asc' },
    });
  }
}