import { Module } from '@nestjs/common';
import { LabsService } from './labs.service';
import { LabsController } from './labs.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'secret' })
  ],
  controllers: [LabsController],
  providers: [LabsService, PrismaService],
})
export class LabsModule {}