import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Users } from '@prisma/client';

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
}
