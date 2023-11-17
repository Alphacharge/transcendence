import { Socket } from 'socket.io';
import { GameState } from 'src/game/GameState';
import { v4 as uuidv4 } from 'uuid';

export class User {
  id: number;
  socket: Socket | null;

  inGame: boolean;
  gamesPlayed: GameState[]; // REPLACE this with database

  constructor() {
    this.id = uuidv4();
    this.inGame = false;
    this.gamesPlayed = [];
  }
}
