import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('data')
export class PrismaController {
  constructor(
    private readonly prismaService: PrismaService,
    readonly authService: AuthService,
  ) {}

  @Post('userstats')
  async getHistoryMatches(
    @Body() body: { userId: number },
  ): Promise<{ userHistory: any[] | null; userProfil: any | null }> {
    const { userId } = body;
    try {
      const userHistory =
        await this.prismaService.getHistoryMatchesById(userId);
      const userProfil = await this.prismaService.getUserById(userId);
      return { userHistory, userProfil };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      return { userHistory: null, userProfil: null };
    }
  }

  @Post('allstats')
  async getUserStatistics(): Promise<any | null> {
    return await this.prismaService.getUserStatistics();
  }

  @Post('friends')
  async getFriendsById(
    @Body() body: { userId: number },
  ): Promise<{ friends: any[] | null }> {
    const { userId } = body;
    try {
      const friends = await this.prismaService.getFriendsById(userId);
      friends.forEach((element) => {
        if (this.authService.activeUser.includes(element.id)) {
          element.status = 1;
        }
      });
      console.log(this.authService.activeUser);
      console.log(friends);
      return { friends };
    } catch (error) {
      console.error('Error fetching friends:', error);
      return { friends: null };
    }
  }
}
