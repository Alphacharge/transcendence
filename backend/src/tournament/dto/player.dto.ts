import { Users } from '@prisma/client';
export class PlayerDto {
  playerToken: string;
  userId: number;
  userData: Users | undefined = undefined;

  constructor(playerToken: string, userId: number) {
    this.playerToken = playerToken;
    this.userId = userId;
  }
}
