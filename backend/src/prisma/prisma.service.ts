import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Users } from '@prisma/client';
import { GameState } from 'src/game/GameState';

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

  async getUser(userId: number): Promise<Users | null> {
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

  async createGame(game: GameState) {
    // Assuming you're using Prisma to interact with a database
    game.gameData = await this.games.create({
      data: {
        left_user_id: game.user1.userData.id,
        right_user_id: game.user2.userData.id,
        left_user_score: 0,
        right_user_score: 0,
        createdAt: new Date(),
      },
    });

    // if (game.tournamentStatus & 2) {
    //   console.log('createGame, Tournament first round');
    // }
    // if (game.tournamentStatus & 4) {
    //   console.log('createGame, Tournament second round');
    // }

    return game;
  }

  async updateGame(game: GameState) {
    try {
      await this.games.update({
        where: { id: game.gameData.id }, // Specify the condition for the row to be updated (in this case, based on the game's ID)
        data: {
          left_user_score: game.scorePlayer1,
          right_user_score: game.scorePlayer2,
          // Other fields you want to update
        },
      });
    } catch (error) {
      console.error('game.service.saveGameToDatabase error:', error);
    }
  }
}
