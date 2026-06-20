import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabsService {
  constructor(private prisma: PrismaService) {}

  async getAllSubjects() {
    return this.prisma.subject.findMany();
  }

  async getAllLabsWithSubjects(studentId: number) {
    const labs = await this.prisma.labWork.findMany();
    const subjects = await this.prisma.subject.findMany();
    
    const submissions = await this.prisma.labSubmission.findMany({
       where: { studentId }
    });

    return labs.map(lab => ({
      ...lab,
      subjectName: subjects.find(s => s.id === lab.subjectId)?.name || 'Неизвестный предмет',
      submissions: submissions.filter(sub => sub.labWorkId === lab.id)
    }));
  }

  async getAllSubmissionsWithSubjects() {
    const submissions = await this.prisma.labSubmission.findMany({
      include: { student: true }
    });
    const labs = await this.prisma.labWork.findMany();
    const subjects = await this.prisma.subject.findMany();

    return submissions.map(sub => {
      const lab = labs.find(l => l.id === sub.labWorkId);
      const subjectName = lab ? subjects.find(s => s.id === lab.subjectId)?.name : 'Неизвестный предмет';
      return {
        ...sub,
        labWork: { ...lab, subjectName }
      };
    });
  }

  async createLabWork(title: string, description: string, deadline: string, isTeamWork: boolean, subjectId: number) {
    return this.prisma.labWork.create({
      data: { title, description, deadline: new Date(deadline), isTeamWork, subjectId }
    });
  }

  async submitLab(studentId: number, labWorkId: number, fileUrl: string) {
    return this.prisma.labSubmission.create({
      data: { studentId, labWorkId, fileUrl }
    });
  }

  async gradeSubmission(submissionId: number, mark: number, comment: string) {
    return this.prisma.labSubmission.update({
      where: { id: submissionId },
      data: { mark, comment }
    });
  }
}