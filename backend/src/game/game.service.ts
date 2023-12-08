// game.service.ts
import { sharedEventEmitter } from './game.events';
import { GameState } from './GameState';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/User';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { TournamentState } from './TournamentState';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  queueTournament: User[] = [];
  queue: User[] = [];
  websocketUsers: Map<string, User> = new Map(); //socket.id -> user

  async startLocalGame(socket: Socket) {
    const user = this.websocketUsers.get(socket.id);
    if (user.activeTournament || user.activeGame) return;

    const game = new GameState();
    game.isLocalGame = true;
    game.user1 = user;

    user.activeGame = game;

    await game.countDown();
    sharedEventEmitter.emit('prepareGame', game);

    const updateRate = 5;

    game.intervalId = setInterval(() => {
      this.animateBall(game);
    }, updateRate);
    sharedEventEmitter.emit('startGame');
  }

  /* A new user is added to the game queue */
  addToQueue(socket: Socket) {
    // find the matching user
    const user = this.websocketUsers.get(socket.id);

    // check if user already is in queue
    if (
      !user ||
      this.queue.find(
        (queuedUser) =>
          queuedUser.userData &&
          user.userData &&
          queuedUser.userData.id === user.userData.id,
      )
    )
      return;
    // check if user already is in an active game
    if (user.activeGame) {
      return;
    }

    console.log(
      `GAME.SERVICE: ADDTOQUEUE, Client ${socket.id} entered game queue`,
    );
    this.queue.push(user);
    // check if a game is ready to be started
    if (this.queue.length >= 2) {
      const game = new GameState();
      game.user1 = this.queue.pop();
      game.user2 = this.queue.pop();
      this.startGame(game);
    }
  }

  addToTournamentQueue(socket: Socket, tournamentStatus: number) {
    const user = this.websocketUsers.get(socket.id);

    if (!user || user.activeTournament) {
      return;
    }
    // check if user already is in queue
    if (
      !user ||
      this.queueTournament.find(
        (queuedUser) =>
          queuedUser.userData &&
          user.userData &&
          queuedUser.userData.id === user.userData.id,
      )
    )
      return;

    this.queueTournament.push(user);
    sharedEventEmitter.emit('addedToTournamentQueue', user);

    console.log(
      `GAME.SERVICE: ADDTOTOURNAMENTQUEUE, Client ${socket.id} entered tournament queue, tournament status ${tournamentStatus}`,
    );

    if (tournamentStatus < 8 && this.queueTournament.length >= 4) {
      this.startTournament();
    }
  }

  /* Remove a user from the game queue */
  removeFromQueue(socket: Socket) {
    const user = this.websocketUsers.get(socket.id);
    // Find the user in the queue
    const userToRemove = this.queue.find(
      (queuedUser) =>
        queuedUser.userData &&
        user.userData &&
        queuedUser.userData.id === user.userData.id,
    );
    if (userToRemove) {
      // Remove the user from the queue
      const index = this.queue.indexOf(userToRemove);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    }
  }

  removeFromTournamentQueue(socket: Socket) {
    const user = this.websocketUsers.get(socket.id);

    const userToRemove = this.queueTournament.find(
      (queuedUser) =>
        queuedUser.userData &&
        user.userData &&
        queuedUser.userData.id === user.userData.id,
    );
    if (userToRemove) {
      sharedEventEmitter.emit('removedFromTournamentQueue', user);

      const index = this.queueTournament.indexOf(userToRemove);
      if (index !== -1) {
        this.queueTournament.splice(index, 1);
      }
    }
  }

  startTournament() {
    const tournament = new TournamentState();

    tournament.players = this.queueTournament.splice(0, 4);

    if (tournament.players.length < 4) {
      console.log('Not enough players for the tournament.');
      return;
    }
    // players are now locked and can't leave any more

    // RISKY
    // could mix up winners and people who haven't played yet
    tournament.winners = tournament.players.slice();
    tournament.setUsers();

    sharedEventEmitter.emit('tournamentStart', tournament);

    let game = tournament.nextGame();
    while (game) {
      this.startGame(game);
      game = tournament.nextGame();
    }
  }

  async startGame(game: GameState) {
    if (!game) return;

    if (game.user1.activeGame || game.user2.activeGame) {
      console.log('startGame: User already in active game.');
      return;
    }
    game.user1.activeGame = game;
    game.user2.activeGame = game;

    game.gameData = await this.prismaService.createNewGame(
      game.user1.userData.id,
      game.user2.userData.id,
    );
    await game.countDown();

    if (!game.gameData) {
      console.log(
        'GAME.SERVICE: STARTGAME, Failed to create new Game!',
        this.queue.length,
      );
      return;
    }

    // this.games.set(game.gameData.id, game);
    sharedEventEmitter.emit('prepareGame', game);

    console.log('GAME.SERVICE: STARTGAME, Starting game', game.gameData.id);
    const updateRate = 5;

    game.intervalId = setInterval(() => {
      this.animateBall(game);
    }, updateRate);
    sharedEventEmitter.emit('startGame', game);
  }

  paddleUp(player: User, leftOrRight: string) {
    const game = player.activeGame;

    if (game && game.isRunning()) {
      if (game.isLocalGame && leftOrRight == 'right') {
        game.movePaddleUp(null);
      } else {
        game.movePaddleUp(player);
      }
    }
    return game;
  }

  paddleDown(player: User, leftOrRight: string) {
    const game = player.activeGame;

    if (game && game.isRunning()) {
      if (game.isLocalGame && leftOrRight == 'right') {
        game.movePaddleDown(null);
      } else {
        game.movePaddleDown(player);
      }
    }
    return game;
  }

  endGame(game: GameState) {
    if (!game.isLocalGame) {
      this.prismaService.updateGameScore(
        game.gameData.id,
        game.scorePlayer1,
        game.scorePlayer2,
        game.winningPlayer.userData.id,
        );
      }
    game.playerVictory();

    game.user1.activeGame = null;
    if (game.user2) game.user2.activeGame = null;

    if (game.tournamentState) {
      if (
        game.tournamentState.gamesNeeded == game.tournamentState.gamesPlayed
      ) {
        game.tournamentState.freeUsers();
      }

      this.startGame(game.tournamentState.nextGame());
    }

    // this.games.delete(game.gameData.id);
  }

  animateBall(game: GameState) {
    //check if ending condition is met
    if (game.hasEnded()) {
      this.endGame(game);
      return;
    }

    //right wins?
    game.leftBreakthrough();
    // left wins?
    game.rightBreakthrough();
    // playfield collisions?
    game.collisionField();
    // paddle collisions?
    game.collisionLeft();
    game.collisionRight();
    // Update the ball's position
    game.ballX += game.ballSpeedX;
    game.ballY += game.ballSpeedY;
    sharedEventEmitter.emit('ballPositionUpdate', game);
  }
}
