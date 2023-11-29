import { User } from 'src/user/User';
import { GameState } from './GameState';

export class TournamentState {
  id: number;
  round: number; // old tournamentStatus from GameState
  gamesNeeded: number;
  gamesPlayed: number;
  players: User[];
  winners: User[];

  constructor() {
    this.round = 1;
    this.gamesNeeded = 3;
    this.gamesPlayed = 0;
    this.players = [];
    this.winners = [];
  }

  setUsers() {
    for (const player of this.players) {
      player.activeTournament = this;
    }
  }

  freeUsers() {
    for (const player of this.players) {
      player.activeTournament = null;
    }
  }

  nextGame(): GameState | null {
    while (this.winners.length < 2) {
      return null;
    }

    const game = new GameState();
    game.user1 = this.winners.pop();
    game.user2 = this.winners.pop();

    game.tournamentState = this;

    return game;
  }
}
