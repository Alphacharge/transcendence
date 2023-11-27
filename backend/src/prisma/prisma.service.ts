import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Users, Games, Tournaments } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  //User
  async createUserBySignUp(
    inEmail: string,
    inHash: string,
  ): Promise<Users | null> {
    try {
      const newUser = await this.users.create({
        data: {
          email: inEmail,
          hash: inHash,
        },
      });
      return newUser;
    } catch (error) {
      console.error('Error creating User on SignUp:', error);
      return null;
    }
  }

  async getUserById(userId: number): Promise<Users | null> {
    console.log('Search User with ID: ', userId);

    try {
      const userData = await this.users.findUnique({
        where: { id: Number(userId) },
      });

      if (userData) {
        delete userData.hash;
        return userData;
      } else {
        console.error(`User with ID ${userId} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getUserByEmail(userEmail: string): Promise<Users | null> {
    console.log('Search User with email: ', userEmail);

    try {
      const userData = await this.users.findUnique({
        where: { email: userEmail },
      });

      return userData;
      } else {
        console.error(`User with email ${userEmail} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getAllUsersIdNiAv(): Promise<
    { id: number; nick: string; avatar: number }[] | null
  > {
    try {
      const allUsers = await this.users.findMany({
        select: {
          id: true,
          nick: true,
          avatar: true,
        },
      });
      return allUsers;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async createNewGame(leftId: number, rightId: number): Promise<Games | null> {
    // Assuming you're using Prisma to interact with a database
    try {
      const GameData: Games = await this.games.create({
        data: {
          left_user_id: leftId,
          right_user_id: rightId,
          left_user_score: 0,
          right_user_score: 0,
          // CHECK why -1 isn't working
          winner_id: 1,
          createdAt: new Date(),
        },
      });
      return GameData;
    } catch (error) {
      console.error('Error creating new game:', error);
      return null;
    }
  }

  async updateGameScore(
    gameId: number,
    leftScore: number,
    rightScore: number,
    winnerId: number,
  ) {
    try {
      const updatedGame = await this.games.update({
        where: { id: gameId }, // Specify the condition for the row to be updated (in this case, based on the game's ID)
        data: {
          left_user_score: leftScore,
          right_user_score: rightScore,
          winner_id: winnerId,
        },
      });
      console.log('GAME.STATE: UPDATEGAMESCORE, Updated game:', updatedGame);
    } catch (error) {
      console.error('GAME.STATE: UPDATEGAMESCORE, Error updating game:', error);
    }
  }

  //Tournament
  async createNewTournament(firstGameId: number, secondGameId: number, thirdGameId: number, tourWinnerId: number): Promise<Tournaments | null> {
    // Assuming you're using Prisma to interact with a database
    try {
      const TournamentData: Tournaments = await this.tournaments.create({
        data: {
          first_game_id: firstGameId,
          second_game_id: secondGameId,
          third_game_id: thirdGameId,
          tourwinner_id: tourWinnerId,
          createdAt: new Date(),
        },
      });
      return TournamentData;
    } catch (error) {
      console.error('Error creating new tournament:', error);
      return null;
    }
  }

  //Stats
  async getGameWinsById(userId: number): Promise<number> {
    try {
      const wins: number = await this.games.count({
        where: {
          winner_id: userId,
        },
      });
      return wins;
    } catch (error) {
      console.error('Error counting wins:', error);
      return 0;
    }
  }

  async getGameLossesById(userId: number): Promise<number> {
    try {
      const lost: number = await this.games.count({
        where: {
          OR: [
            {
              left_user_id: userId,
            },
            {
              right_user_id: userId,
            }
          ],
          NOT: {
            winner_id: userId,
          },
        },
      });
      return lost;
    } catch (error) {
      console.error('Error counting losses:', error);
      return 0;
    }
  }

  async getAmountOfMatchesById(userId: number): Promise<number> {
    try {
      const matches: number = await this.games.count({
        where: {
          OR: [
            {
              left_user_id: userId,
            },
            {
              right_user_id: userId,
            },
          ],
        },
      });
      return matches;
    } catch (error) {
      console.error('Error counting losses:', error);
      return 0;
    }
  }

  async getAmountOfTournamentMatchesById(userId: number): Promise<number> {
    try {
      const tournamentCount: number = await this.tournaments.count({
        where: {
          OR: [
            {
              f_game: {
                OR: [
                  { left_user_id: userId },
                  { right_user_id: userId },
                ],
              },
            },
            {
              s_game: {
                OR: [
                  { left_user_id: userId },
                  { right_user_id: userId },
                ],
              },
            },
            {
              t_game: {
                OR: [
                  { left_user_id: userId },
                  { right_user_id: userId },
                ],
              },
            },
          ],
        },
      });
      return tournamentCount;
    } catch (error) {
      console.error('Error counting losses:', error);
      return 0;
    }
  }

  async getTournamentWinsById(userId: number): Promise<number> {
    try {
      const wins: number = await this.tournaments.count({
        where: {
          tourwinner_id: userId,
        },
      });
      return wins;
    } catch (error) {
      console.error('Error counting wins:', error);
      return 0;
    }
  }

  async getUserStatistics() {
    const allUsers = await this.getAllUsersIdNiAv();
    const userStatistics = [];

    for (const user of allUsers) {
      const matches: number = await this.getAmountOfMatchesById(user.id);
      const wins: number = await this.getGameWinsById(user.id);
      const losses: number = await this.getGameLossesById(user.id);
      const tourmatches: number = await this.getAmountOfTournamentMatchesById(
        user.id,
      );
      const tourwins: number = await this.getTournamentWinsById(user.id);

      userStatistics.push({
        userId: user.id,
        nick: user.nick,
        avatar: user.avatar,
        matches,
        wins,
        losses,
        tourmatches,
        tourwins,
      });
    }
    return userStatistics;
  }

  async getHistoryMatchesById(userId: number): Promise<any[] | null> {
    try {
      const allGames = await this.games.findMany({
        where: {
          OR: [{ left_user_id: userId }, { right_user_id: userId }],
        },
        orderBy: {
          id: 'desc',
        },
        include: {
          l_user: {
            select: {
              id: true,
              nick: true,
              avatar: true,
            },
          },
          r_user: {
            select: {
              id: true,
              nick: true,
              avatar: true,
            },
          },
        },
      });

      return allGames.map((game) => ({
        id: game.id,
        left_user_score: game.left_user_score,
        right_user_score: game.right_user_score,
        leftUser: {
          id: game.l_user.id,
          nick: game.l_user.nick,
          avatar: game.l_user.avatar,
        },
        rightUser: {
          id: game.r_user.id,
          nick: game.r_user.nick,
          avatar: game.r_user.avatar,
        },
      }));
    } catch (error) {
      console.error('Error fetching match history:', error);
      return null;
    }
  }
}
