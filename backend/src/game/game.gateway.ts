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
import { GameService } from './game.service';
import { User } from 'src/user/User';
import { GameState} from './GameState';
import * as https from 'https';
import * as fs from 'fs';

// can enter a port in the brackets
@WebSocketGateway({ server: https.createServer({
  key: fs.readFileSync('/certificates/certificate.key'),
  cert: fs.readFileSync('/certificates/certificate.cert'),
})})
export class GameGateway {
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
    sharedEventEmitter.on('victory', (game: GameState) => {
      this.announceVictory(game);
    });
  }

  handleConnection(socket: any) {
    console.log("Client connected:", socket.id);

    // MISSING: TOKEN authentication, database pull and check if user is already connected
    const user = new User();
    user.socket = socket;
    this.gameService.users.set(socket.id, user);
  }

  handleDisconnect(socket: any) {
    console.log("Client disconnected:", socket.id);

    // get the right user
    const user = this.gameService.users.get(socket.id);

    // delete the socket id
    user.socket = null;
  }

  @SubscribeMessage('enterQueue')
  enterQueue(@ConnectedSocket() socket: Socket) {
    this.gameService.addToQueue(socket);
  }

  @SubscribeMessage('leaveQueue')
  leaveQueue(@ConnectedSocket() socket: Socket) {
    this.gameService.removeFromQueue(socket);
  }

  /* Client requests to abort game. */
  @SubscribeMessage('stopGame')
  stopGame(@MessageBody() payload) {
    if (payload) this.gameService.stopGame(payload);
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
    game.user1.socket.emit('gameId', { gameId: game.GameData.id });
    game.user2.socket.emit('gameId', { gameId: game.GameData.id });
    // tell the client the player number
    game.user1.socket.emit('player1');
    game.user2.socket.emit('player2');
    // send game info here?
	this.sendPaddleUpdate(game);
	this.sendBallUpdate(game);
	this.sendScoreUpdate(game);
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
    game.user1.socket.emit('leftPaddle', game.leftPosition);
    game.user1.socket.emit('rightPaddle', game.rightPosition);
    game.user2.socket.emit('leftPaddle', game.leftPosition);
    game.user2.socket.emit('rightPaddle', game.rightPosition);
  }

  // listen for paddle updates
  @SubscribeMessage('paddleUp')
  leftPaddleUp(@MessageBody() { gameId, playerNumber }: { gameId: number; playerNumber: number }) {

    if (gameId) {
      const game = this.gameService.paddleUp(gameId, playerNumber);
      if (game) this.sendPaddleUpdate(game);
    }
  }

  @SubscribeMessage('paddleDown')
  PaddleDown(@MessageBody() { gameId, playerNumber }: { gameId: number; playerNumber: number }) {
    if (gameId) {
      const game = this.gameService.paddleDown(gameId, user);
      if (game) this.sendPaddleUpdate(game);
    }
  }

  announceVictory(game: GameState) {
    game.user1.socket.emit('victory', game.winningPlayer);
    game.user2.socket.emit('victory', game.winningPlayer);
  }
}
