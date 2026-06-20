import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, Req, Body, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LabsService } from './labs.service';
import { JwtService } from '@nestjs/jwt';

@Controller('labs')
export class LabsController {
  constructor(
    private readonly labsService: LabsService,
    private readonly jwtService: JwtService
  ) {}

  @Get('all-subjects')
  async getAllSubjects() {
    return this.labsService.getAllSubjects();
  }

  @Get('all-labs')
  async getAllLabs(@Req() request: any) {
    const token = request.cookies['jwt'];
    if (!token || token === 'undefined') throw new UnauthorizedException();
    const payload = this.jwtService.decode(token) as any;
    if (!payload) throw new UnauthorizedException();
    return this.labsService.getAllLabsWithSubjects(payload.sub);
  }

  @Get('all-submissions')
  async getAllSubmissions() {
    return this.labsService.getAllSubmissionsWithSubjects();
  }

  @Post('submit')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('labWorkId') labWorkId: string,
    @Req() request: any
  ) {
    const token = request.cookies['jwt'];
    if (!token || token === 'undefined') throw new UnauthorizedException();
    const payload = this.jwtService.decode(token) as any;
    if (!payload) throw new UnauthorizedException();
    const fileUrl = `/uploads/${file.filename}`;
    return this.labsService.submitLab(payload.sub, Number(labWorkId), fileUrl);
  }

  @Post('grade')
  async gradeSubmission(
    @Body('submissionId') submissionId: string,
    @Body('mark') mark: string,
    @Body('comment') comment: string
  ) {
    return this.labsService.gradeSubmission(Number(submissionId), Number(mark), comment);
  }

  @Post('create')
  async createLabWork(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('deadline') deadline: string,
    @Body('isTeamWork') isTeamWork: boolean,
    @Body('subjectId') subjectId: number,
    @Req() request: any
  ) {
    const token = request.cookies['jwt'];
    if (!token || token === 'undefined') throw new UnauthorizedException();
    const payload = this.jwtService.decode(token) as any;
    if (!payload || payload.role !== 'TEACHER') throw new UnauthorizedException();
    return this.labsService.createLabWork(title, description, deadline, isTeamWork, Number(subjectId));
  }
}