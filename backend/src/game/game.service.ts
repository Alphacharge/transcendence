// game.service.ts
import { clearInterval } from 'timers';
import { sharedEventEmitter } from './game.events';
import { GameState } from './GameState';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/User';
import { Socket } from 'socket.io';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class GameService {
  // user array
  // should probably be saved elsewhere, idk

  queueTournamentGame: User[] = [];
  users: Map<string, User> = new Map(); // user.id -> user
  games: Map<number, GameState> = new Map(); // gamestate.gameid -> gamestate
  queue: User[] = [];
  prisma: PrismaClient;


  /* A new user is added to the game queue */
  addToQueue(socket: Socket) {
    // find the matching user
    const user = this.users.get(socket.id);

	//user.id = 1 //
    // check if user already is in queue
    // REPLACE socket id with working user id
    if (!user || this.queue.find(queuedUser => queuedUser.id === user.id)) return;
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
    const user = this.users.get(socket.id);
    // Find the user in the queue
    const userToRemove = this.queue.find(queuedUser => queuedUser.id === user.id);

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
	  if (this.queue.length >= 2){
		console.log(this.queue.length);
		this.startGame();
	} 
  }

async startGame() {
    const game = new GameState();
	game.user1 = this.queue.pop();
	game.user2 = this.queue.pop();
	console.log("user1: ", game.user1.id, "user2: ", game.user2.id);
	await game.initializeGame(game.user1.id, game.user2.id);

	if (!game.GameData) {
		console.log('Game: Failed to create new Game!', this.queue.length);
		return;
	}

    const updateRate = 1000 / 60;


    game.user1.inGame = true;
    game.user2.inGame = true;

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

    if (game.user1) game.user1.inGame = false;
    if (game.user2) game.user2.inGame = false;

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

