import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async seedUsers() {
    const hash = await bcrypt.hash('123456', 10);
    
    const group = await this.prisma.group.upsert({
      where: { name: 'Т-394' },
      update: {},
      create: { name: 'Т-394' }
    });

    await this.prisma.user.upsert({
      where: { email: 'teacher@test.com' },
      update: {},
      create: {
        email: 'teacher@test.com',
        password: hash,
        role: 'TEACHER',
        firstName: 'Котя',
        lastName: 'Пивозавр'
      }
    });

    await this.prisma.user.upsert({
      where: { email: 'ashley@test.com' },
      update: {},
      create: {
        email: 'ashley@test.com',
        password: hash,
        role: 'STUDENT',
        firstName: 'Эшли',
        lastName: 'Белл',
        groupId: group.id
      }
    });

    return { message: 'Тестовые пользователи и группа успешно созданы!' };
  }
}