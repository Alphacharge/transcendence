import { Socket } from 'socket.io';
import { Users } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { GameState } from 'src/game/GameState';

export class User {
  id: string;

  socket: Socket | null;
  activeGame: GameState | null;
  userData: Users;

  constructor() {
    this.id = uuidv4();
    this.activeGame = null;
  }
}
