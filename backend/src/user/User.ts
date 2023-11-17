import { Socket } from 'socket.io';
import { PrismaClient, Users } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { GameState } from 'src/game/GameState';

export class User {
  socket: Socket | null;
  activeGame: GameState | null;
  userData: Users;
  prisma: PrismaClient;

  constructor() {
    this.activeGame = null;
    this.socket = null;
    this.userData = undefined;
    this.prisma = new PrismaClient();
  }

  async findInDatabase(userId: number) {
    this.userData = await this.prisma.users.findUnique({
      where: { id: Number(userId) },
    });
    if (this.userData) {
      delete this.userData.hash;
    } else {
      console.error(`User with ID ${userId} not found.`);
      return -1;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return -1;
  }
}
