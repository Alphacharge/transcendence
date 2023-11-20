import { Socket } from 'socket.io';
import { Users } from '@prisma/client';
import { GameState } from 'src/game/GameState';

export class User {
  socket: Socket | null;
  activeGame: GameState | null;
  userData: Users;

  constructor() {
    this.activeGame = null;
    this.socket = null;
    this.userData = undefined;
  }
}
