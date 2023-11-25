import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('stats')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('user')
  async getHistoryMatchesById(@Body() body: { userId: number }): Promise<any[] | null> {
    const { userId } = body;
    return this.prismaService.getHistoryMatchesById(userId);
  }

  @Post('all')
  async getUserStatistics(): Promise<any | null> {
    return this.prismaService.getUserStatistics();
  }
}