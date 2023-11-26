import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('stats')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('user')
  async getHistoryMatches(@Body() body: { userId: number }): Promise<{ userHistory: any[] | null, userProfil: any | null }> {
    const { userId } = body;
    try {
      const userHistory = await this.prismaService.getHistoryMatchesById(userId);
      const userProfil = await this.prismaService.getUserById(userId);
      return { userHistory, userProfil };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      return { userHistory: null, userProfil: null };
    }
  }

  @Post('all')
  async getUserStatistics(): Promise<any | null> {
    return await this.prismaService.getUserStatistics();
  }
}