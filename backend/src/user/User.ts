import { Socket } from 'socket.io';
import { GameState } from 'src/game/GameState';
import { TournamentState } from 'src/game/TournamentState';

export class User {
  socket: Socket | null;
  activeGame: GameState | null;
  activeTournament: TournamentState | null;
  userData: any;

  constructor() {
    this.socket = null;
    this.activeGame = null;
    this.activeTournament = null;
    this.userData = null;
  }
}
