// game.service.ts
import { clearInterval } from 'timers';
import { sharedEventEmitter } from './game.events';
import { GameState } from './GameState';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/User';
import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class GameService {
  queueTournamentGame: User[] = [];
  queue: User[] = [];
  users: Map<string, User> = new Map(); // user.id -> user
  games: Map<number, GameState> = new Map(); // gamestate.gameid -> gamestate
  prisma: PrismaClient;

  /* A new user is added to the game queue */
  addToQueue(socket: Socket) {
    /*


	add same logic as tournament add player, need a playerdto with token


	*/
    // find the matching user
    const user = this.users.get(socket.id);

    // check if user already is in queue
    // REPLACE socket id with working user id
    if (
      !user ||
      this.queue.find(
        (queuedUser) => queuedUser.userData.id === user.userData.id,
      )
    )
      return;
    // check if user already is in an active game
    if (user.activeGame) {
      console.log('Client is already playing');
      return;
    }

    console.log(`Client ${socket.id} entered game queue`);
    this.queue.push(user);
    // check if a game is ready to be started
    this.checkQueue();
  }

  addToTournamentQueue(socket: Socket, tournamentStatus: number) {
    const user = this.users.get(socket.id);

    this.queueTournamentGame.push(user);
    console.log(
      `Client ${socket.id} entered tournament queue, tournament status ${tournamentStatus}`,
    );

    if (tournamentStatus < 8 && this.queueTournamentGame.length >= 2) {
      this.startGame(tournamentStatus);
    }
  }

  /* Remove a user from the game queue */
  removeFromQueue(socket: Socket) {
    const user = this.users.get(socket.id);
    // Find the user in the queue
    const userToRemove = this.queue.find(
      (queuedUser) => queuedUser.userData.id === user.userData.id,
    );
    if (userToRemove) {
      // Remove the user from the queue
      const index = this.queue.indexOf(userToRemove);
      if (index !== -1) {
        this.queue.splice(index, 1);
        console.log(`Client: ${socket.id} removed from game queue`);
      }
    }
  }

  checkQueue() {
    if (this.queue.length >= 2) {
      console.log(this.queue.length);

      const tournamentStatus = 0; // added for readability
      this.startGame(tournamentStatus);
    }
  }

  async startGame(tournamentStatus: number) {
    let user1: User;
    let user2: User;
    if (!tournamentStatus) {
      user1 = this.queue.pop();
      user2 = this.queue.pop();
    } else {
      user1 = this.queueTournamentGame.pop();
      user2 = this.queueTournamentGame.pop();
    }
    const game = new GameState(user1, user2);
    game.tournamentStatus = tournamentStatus;
    console.log(
      'user1: ',
      game.user1.userData.id,
      'user2: ',
      game.user2.userData.id,
    );
    await game.initializeGame(game.user1.userData.id, game.user2.userData.id);

    if (!game.GameData) {
      console.log('Game: Failed to create new Game!', this.queue.length);
      return;
    }

    const updateRate = 1000 / 60;

    game.user1.activeGame = game;
    game.user2.activeGame = game;

    this.games.set(game.GameData.id, game);
    sharedEventEmitter.emit('prepareGame', game);

    console.log('Game: Starting multiplayer game', game.GameData.id);
    game.intervalId = setInterval(() => {
      this.animateBall(game);
    }, updateRate);
    sharedEventEmitter.emit('startGame', game);
  }

  stopGame(gameState: GameState): void;
  stopGame(gameId: number): void;
  stopGame(arg: GameState | number): void {
    let game: GameState;

    if (typeof arg === 'number') game = this.games.get(arg);
    else game = arg;
    if (!game) {
      console.error("Game: Couldn't stop. Game not found.");
      return;
    }

    console.log('Stopping game', game.GameData.id);
    clearInterval(game.intervalId);
    game.intervalId = null;

    if (game.user1) game.user1.activeGame = null;
    if (game.user2) game.user2.activeGame = null;

    // save persistent game stuff to database here if you like
    this.games.delete(game.GameData.id);
  }

  paddleUp(GameId: number, player: User) {
    const game = this.games.get(GameId);
    if (game && game.isRunning()) {
      game.movePaddleUp(player);
    }
    return game;
  }

  paddleDown(GameId: number, player: User) {
    const game = this.games.get(GameId);
    if (game && game.isRunning()) {
      game.movePaddleDown(player);
    }
    return game;
  }

  animateBall(game: GameState) {
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
    game.playerVictory();
    game.ballX += game.ballSpeedX;
    game.ballY += game.ballSpeedY;
    sharedEventEmitter.emit('ballPositionUpdate', game);
  }
}
