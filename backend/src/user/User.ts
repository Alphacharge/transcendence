import { Socket } from 'socket.io';
import { Users } from '@prisma/client';
import { GameState } from 'src/game/GameState';
import { TournamentState } from 'src/game/TournamentState';

export class User {
  socket: Socket | null;
  activeGame: GameState | null;
  activeTournament: TournamentState | null;
  userData: Users;

  constructor() {
    this.socket = null;
    this.activeGame = null;
    this.activeTournament = null;
    this.userData = null;
  }
}
