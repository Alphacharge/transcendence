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
  games: Map<string, GameState> = new Map(); // gamestate.gameid -> gamestate

  /* A new user is added to the game queue */
  addToQueue(socket: Socket) {
    // find the matching user
    const user = this.users.get(socket.id);

    // check if user already is in queue
    // REPLACE socket id with working user id
    if (!user || this.queue.find(queuedUser => queuedUser.socket.id === user.socket.id)) return;

    console.log(`Client ${socket.id} entered game queue`);
    this.queue.push(user);
    // check if a game is ready to be started
    this.checkQueue();
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
      console.error('Game not found.');
      return;
    }
    console.log('Stopping game', game.gameId);
    clearInterval(game.intervalId);
    game.intervalId = null;

    if (game.user1) game.user1.inGame = false;
    if (game.user2) game.user2.inGame = false;

    // save persistent game stuff to database here if you like
    this.games.delete(gameId);
  }

  leftPaddleUp(gameId: string) {
    const game = this.games.get(gameId);
    if (game && game.leftPaddleY > 10) {
      game.leftPaddleY -= 10;
    }
    return game;
  }

  leftPaddleDown(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) {
      console.error("game not found!");
      return;
    }
    if (game && game.leftPaddleY + 100 + 10 < 400) {
      game.leftPaddleY += 10;
    }
    return game;
  }

  animateBall(game: GameState) {
    const ballLeft = game.ballX - 5;
    const ballRight = game.ballX + 5;
    const ballTop = game.ballY - 5;
    const ballBottom = game.ballY + 5;

    // Check for collision with square borders
    /* changed game.field.. with this.gameStart.field... to be sure to pick correct
		field sizes, see also constructor [losordo]*/
    // left boundary
    if (ballLeft <= 5) {
      game.ballSpeedX = -game.ballSpeedX;
      game.scorePlayer2 += 1;
      sharedEventEmitter.emit('scoreUpdate', game);
    }
    // right boundary
    if (ballRight >= game.fieldX - 10) {
      game.ballSpeedX = -game.ballSpeedX; // Reverse X direction
      game.scorePlayer1 += 1;
      sharedEventEmitter.emit('scoreUpdate', game);
    }
    if (ballTop <= 1 || ballBottom >= game.fieldY - 10) {
      game.ballSpeedY = -game.ballSpeedY; // Reverse Y direction
    }
    // Calculate paddle boundaries
    const paddleLeft = 40; // Adjust this value based on your paddle's initial position
    const paddleRight = paddleLeft + 10; // Paddle width
    const paddleTop = game.leftPaddleY;
    const paddleBottom = game.leftPaddleY + 100; // Paddle height

    // Check for collision with the paddle
    if (
      ballRight > paddleLeft - 5 &&
      ballLeft < paddleRight - 5 &&
      ballBottom > paddleTop &&
      ballTop < paddleBottom - 5
    ) {
      game.ballSpeedX = -game.ballSpeedX;
    }

    // Update the ball's position
    game.ballX += game.ballSpeedX;
    game.ballY += game.ballSpeedY;

    sharedEventEmitter.emit('ballPositionUpdate', game);
  }
}
