import { User } from 'src/user/User';
import { GameState } from './GameState';

export class TournamentState {
  id: number;
  gamesNeeded: number;
  gamesPlayed: number;
  players: User[];
  winners: User[];
  playedGames: GameState[];

  constructor() {
    this.gamesNeeded = 3;
    this.gamesPlayed = 0;
    this.players = [];
    this.winners = [];
    this.playedGames = [];
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
    this.playedGames.push(game);
    game.user1 = this.winners.pop();
    game.user2 = this.winners.pop();

    game.tournamentState = this;

    return game;
  }
}
