import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Users, Games } from '@prisma/client';

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
    console.log("Search User with ID: ", userId);

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

  async createNewGame(leftId: number, rightId: number): Promise<Games | null> {
    // Assuming you're using Prisma to interact with a database
    const GameData: Games = await this.games.create({
      data: {
        left_user_id: leftId,
        right_user_id: rightId,
        left_user_score: 0,
        right_user_score: 0,
        createdAt: new Date(),
      },
    });
    return GameData;
}

  async updateGameScore(gameId: number, leftScore: number, rightScore: number) {
    try {
      const updatedGame = await this.games.update({
        where: { id: gameId }, // Specify the condition for the row to be updated (in this case, based on the game's ID)
        data: {
          left_user_score: leftScore,
          right_user_score: rightScore,
          // Other fields you want to update
        },
      });
      console.log('GAME.STATE: UPDATEGAMESCORE, Updated game:', updatedGame);
    } catch (error) {
      console.error('GAME.STATE: UPDATEGAMESCORE, Error updating game:', error);
    }
  }
}
