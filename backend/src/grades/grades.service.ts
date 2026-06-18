import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async getTeacherInfo(teacherId: number) {
    const subjects = await this.prisma.subject.findMany();
    const groups = await this.prisma.group.findMany();
    return { subjects, groups };
  }

  async getJournal(groupId: number, subjectId: number) {
    const students = await this.prisma.user.findMany({
      where: { groupId, role: 'STUDENT' },
      orderBy: { lastName: 'asc' }
    });
    const schedule = await this.prisma.schedule.findMany({
      where: { groupId, subjectId },
      orderBy: { date: 'asc' }
    });
    const grades = await this.prisma.grade.findMany({
      where: { schedule: { groupId, subjectId } }
    });
    return { students, schedule, grades };
  }

  async addLesson(teacherId: number, groupId: number, subjectId: number, date: string, startTime: string, endTime: string) {
    const start = new Date(`${date}T${startTime}:00.000Z`);
    const end = new Date(`${date}T${endTime}:00.000Z`);

    return this.prisma.schedule.create({
      data: {
        date: new Date(date),
        startTime: start,
        endTime: end,
        teacherId,
        groupId,
        subjectId
      }
    });
  }

  async updateGrade(studentId: number, scheduleId: number, action: string, value: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id: scheduleId } });
    let isLate = false;

    if (action === 'mark' && schedule) {
        const now = new Date();
        if (now > schedule.startTime && now < schedule.endTime) {
            isLate = true;
        }
    }

    const existing = await this.prisma.grade.findFirst({
        where: { studentId, scheduleId }
    });

    if (existing) {
        let updateData: any = {};
        if (action === 'mark') { updateData = { value, isAbsent: false }; if (isLate) updateData.isLate = true; }
        if (action === 'absent') { updateData = { isAbsent: !existing.isAbsent, value: null, isLate: false }; }
        if (action === 'late') { updateData = { isLate: !existing.isLate, isAbsent: false }; }

        return this.prisma.grade.update({ where: { id: existing.id }, data: updateData });
    } else {
        let createData: any = { studentId, scheduleId };
        if (action === 'mark') { createData.value = value; createData.isLate = isLate; }
        if (action === 'absent') { createData.isAbsent = true; }
        if (action === 'late') { createData.isLate = true; }

        return this.prisma.grade.create({ data: createData });
    }
  }

  async getStudentGrades(studentId: number) {
    return this.prisma.grade.findMany({
        where: { studentId },
        include: { schedule: { include: { subject: true } } }
    });
  }
}