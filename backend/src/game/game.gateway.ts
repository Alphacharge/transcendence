// game.gateway.ts
import { sharedEventEmitter } from './game.events';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConsoleLogger, OnModuleInit } from '@nestjs/common';
import { GameService } from './game.service';
import { UserDto } from 'src/user/dto';
import { GameState } from './GameState';

// can enter a port in the brackets
@WebSocketGateway()
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {
    sharedEventEmitter.on('prepareGame', (game: GameState) => {
      if (game) this.sendGameId(game);
    });
    sharedEventEmitter.on('startGame', (game: GameState) => {
      if (game) this.sendGameStart(game);
    });
    sharedEventEmitter.on('ballPositionUpdate', (game: GameState) => {
      if (game) this.sendBallUpdate(game);
    });
    sharedEventEmitter.on('scoreUpdate', (game: GameState) => {
      if (game) this.sendScoreUpdate(game);
    });
    sharedEventEmitter.on('paddleUpdate', (game: GameState) => {
      this.sendPaddleUpdate(game);
    });
  }

  /* New client connected. */
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // save new user to users array in GameService
      const user = new UserDto();
      user.socket = socket;
      this.gameService.users.set(socket.id, user);
    });
    this.server.on('close', () => {
      console.log('Client disconnected');
    });
    this.server.on
  }

  handleDisconnect(socket: any) {
    console.log("Client disconnected:", socket.id);

    // get the right user
    const user = this.gameService.users.get(socket.id);
    if (user && user.inGame) {
      // get the active game of the user
      const activeGameId = user.gamesPlayed[user.gamesPlayed.length - 1];
      // stop the game
      if (activeGameId) this.gameService.stopGame(activeGameId);
    }
    // delete the socket id
    user.socket = null;
  }

  @SubscribeMessage('enterQueue')
  enterQueue(@ConnectedSocket() socket: Socket) {
    this.gameService.addToQueue(socket);
  }

  /* Client requests a new game. */
  @SubscribeMessage('newGame')
  newGame(@ConnectedSocket() socket: Socket) {
    console.log(`Received 'newGame' message from socket ID ${socket.id}`);
    // not functional, used for debugging
  }

  /* Client requests to abort game. */
  @SubscribeMessage('stopGame')
  stopGame(@MessageBody() payload: { gameId: string }) {
    if (payload) this.gameService.stopGame(payload.gameId);
  }

  /* Tell the client the game starts now. */
  sendGameStart(game: GameState) {
    game.user1.socket.emit('start');
    game.user2.socket.emit('start');
  }

  /* Prepare the client for the game. */
  sendGameId(game: GameState) {
    // if any user left the game, abort
    if (!game.user1 || !game.user2) {
      console.error("Player left game.");
      return;
    }
    // tell the client the game id
    game.user1.socket.emit('gameId', { gameId: game.gameId });
    game.user2.socket.emit('gameId', { gameId: game.gameId });
    // tell the client the player number
    game.user1.socket.emit('player1');
    game.user2.socket.emit('player2');
    // send game info here?
  }

  // ball coordinate transmission
  sendBallUpdate(game: GameState) {
    game.user1.socket.emit('ballUpdate', game.ballCoordinates());
    game.user2.socket.emit('ballUpdate', game.ballCoordinates());
  }

  sendScoreUpdate(game: GameState) {
    if (game.user1) game.user1.socket.emit('scoreUpdate', game.getScore());
    if (game.user2) game.user2.socket.emit('scoreUpdate', game.getScore());
  }

  // update for both paddles
  sendPaddleUpdate(game: GameState) {
    game.user1.socket.emit('leftPaddle', game.leftPaddleY);
    game.user1.socket.emit('rightPaddle', game.rightPaddleY);
    game.user2.socket.emit('leftPaddle', game.leftPaddleY);
    game.user2.socket.emit('rightPaddle', game.rightPaddleY);
  }

  // listen for paddle updates
  @SubscribeMessage('leftPaddleUp')
  leftPaddleUp(@MessageBody() payload) {
    if (payload) {
      const game = this.gameService.leftPaddleUp(payload);
      if (game) {
        game.user1.socket.emit('leftPaddle', game.leftPaddleY);
        game.user2.socket.emit('leftPaddle', game.leftPaddleY);
      }
    }
  }

  @SubscribeMessage('leftPaddleDown')
  leftPaddleDown(@MessageBody() payload) {
    if (payload) {
      const game = this.gameService.leftPaddleDown(payload);
      if (game){
        game.user1.socket.emit('leftPaddle', game.leftPaddleY);
        game.user2.socket.emit('leftPaddle', game.leftPaddleY);
      }
    }
  }
}
