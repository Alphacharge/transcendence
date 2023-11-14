// game.service.ts
import { clearInterval } from 'timers';
import { sharedEventEmitter } from './game.events';
import { GameState } from './GameState';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  // user array
  // should probably be saved elsewhere, idk
  users: Map<string, UserDto> = new Map(); // socket.id -> user
  queue: UserDto[] = [];
  queueTournamentGame: UserDto[] = [];
  games: Map<string, GameState> = new Map(); // gamestate.gameid -> gamestate

  /* A new user is added to the game queue */
  addToQueue(socket: Socket) {
    // find the matching user
    const user = this.users.get(socket.id);

    // check if user already is in queue
    // REPLACE socket id with working user id
    if (!user || this.queue.find(queuedUser => queuedUser.socket.id === user.socket.id)) return;
	// check if user already is in an active game
	if (user.inGame) {
		console.log("Client is already playing");
		return;
	}

    console.log(`Client ${socket.id} entered game queue`);
    this.queue.push(user);
    // check if a game is ready to be started
    this.checkQueue();
  }

  addToTournamentQueue(socket: Socket) {
    const user = this.users.get(socket.id);
    this.queueTournamentGame.push(user);
    console.log(`Client ${socket.id} entered tournament queue`);
    if(this.queueTournamentGame.length === 2) this.startGame;
  }

  /* Remove a user from the game queue */
  removeFromQueue(socket: Socket) {
    // Find the user in the queue based on socket.id
    const userToRemove = this.queue.find(queuedUser => queuedUser.socket.id === socket.id);

    if (userToRemove) {
      // Remove the user from the queue
      const index = this.queue.indexOf(userToRemove);
      if (index !== -1) {
        this.queue.splice(index, 1);
        console.log(`Client ${socket.id} removed from game queue`);
      }
    }
  }

  checkQueue() {
    while (this.queue.length >= 2) this.startGame();
  }

  startGame() {
    const game = new GameState();
    const updateRate = 1000 / 60;

    game.user1 = this.queue.pop();
    game.user2 = this.queue.pop();

    game.user1.inGame = true;
    game.user2.inGame = true;

    game.user1.gamesPlayed.push(game.gameId);
    game.user2.gamesPlayed.push(game.gameId);

    this.games.set(game.gameId, game);
    sharedEventEmitter.emit('prepareGame', game);

    console.log('Starting multiplayer game', game.gameId);
    game.intervalId = setInterval(() => {
      this.animateBall(game);
    }, updateRate);

    sharedEventEmitter.emit('startGame', game);
  }

  stopGame(gameId: string) {
    // search the right game
    const game = this.games.get(gameId);
    if (!game) {
      console.error('StopGame: Game not found.');
      return;
    }
    console.log('Stopping game', game.gameId);
    clearInterval(game.intervalId);
    game.intervalId = null;

    if (game.user1) game.user1.inGame = false;
    if (game.user2) game.user2.inGame = false;

    // save persistent game stuff to database here if you like
    // this.games.delete(gameId);
  }

  paddleUp(gameId: string, playerNumber: number) {
    const game = this.games.get(gameId);
    if (game && game.isRunning()) {
      game.movePaddleUp(playerNumber);
    }
    return game;
  }

  paddleDown(gameId: string, playerNumber: number) {
    const game = this.games.get(gameId);
    if (game && game.isRunning()) {
      game.movePaddleDown(playerNumber);
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

