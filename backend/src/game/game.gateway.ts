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
import { GameState } from './GameState';
import * as https from 'https';
import * as fs from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

// can enter a port in the brackets
@WebSocketGateway({
  server: https.createServer({
    key: fs.readFileSync('/certificates/certificate.key'),
    cert: fs.readFileSync('/certificates/certificate.cert'),
  }),
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {
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
    sharedEventEmitter.on('countDown', (game: GameState) => {
      this.matchStart(game);
    });
  }

  /* New client connected. */
  async handleConnection(socket: any) {
    console.log(
      'GAME.GATEWAY: HANDLECONNECTION, Client connected sid: ',
      socket.id,
    );
    // ADD: user id will have to be checked too
    // doesn't work right now though so i removed it
    const isValid = await this.authService.validateToken(
      socket.handshake.query.token,
    );
    if (isValid) {
      // save new user to users array in GameService
      const user = new User();

      this.gameService.users.set(socket.id, user);
      user.socket = socket;
      user.userData = await this.prismaService.getUserById(
        socket.handshake.query.userId,
      );
      console.log('userdata:', user.userData.id);
    } else {
      console.log(
        'GAME.GATEWAY: HANDLECONNECTION, Refusing WebSocket connection.',
      );
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: any) {
    console.log(
      'GAME.GATEWAY: HANDLEDISCONNECT, Client disconnected sid:',
      socket.id,
    );

    // get the right user
    const user = this.gameService.users.get(socket.id);

    if (user) {
      // remove user from any queues
      this.gameService.removeFromQueue(socket);
      this.gameService.removeFromTournamentQueue(socket);

      // abort any games the user was part of
      if (user.activeGame) {
        this.gameService.stopGame(user.activeGame);
      }
    }

    // remove user?
  }

  @SubscribeMessage('enterQueue')
  enterQueue(@ConnectedSocket() socket: Socket) {
    this.gameService.addToQueue(socket);
  }

  @SubscribeMessage('enterTournamentQueue')
  enterTournamentQueue(
    @ConnectedSocket() socket: Socket,
    @MessageBody() tournamentStatus: number,
  ) {
    this.gameService.addToTournamentQueue(socket, tournamentStatus);
  }

  @SubscribeMessage('leaveQueue')
  leaveQueue(@ConnectedSocket() socket: Socket) {
    this.gameService.removeFromQueue(socket);
    this.gameService.removeFromTournamentQueue(socket);
  }

  /* Client requests to abort game. */
  @SubscribeMessage('stopGame')
  stopGame(@ConnectedSocket() socket: Socket) {
    const user = this.gameService.users.get(socket.id);

    if (user.activeGame) this.gameService.stopGame(user.activeGame);
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
      console.error('GAME.GATEWAY: SENDGAMEID, Player left game.');
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
  PaddleUp(
    @MessageBody() { gameId }: { gameId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = this.gameService.users.get(socket.id);
    if (gameId && user) {
      const game = this.gameService.paddleUp(gameId, user);
      if (game) this.sendPaddleUpdate(game);
    }
  }

  @SubscribeMessage('paddleDown')
  PaddleDown(
    @MessageBody() { gameId }: { gameId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = this.gameService.users.get(socket.id);
    if (gameId) {
      const game = this.gameService.paddleDown(gameId, user);
      if (game) this.sendPaddleUpdate(game);
    }
  }

  announceVictory(game: GameState) {
    console.log(
      `GAME.GATEWAY: ANNOUNCEVICTORY, DEBUG winning player's id ${game.winningPlayer.userData.id}`,
    );
    game.user1.socket.emit('victory', game.winningPlayer.userData.id);
    game.user2.socket.emit('victory', game.winningPlayer.userData.id);
    /* if winning torunament's first round*/
    if (game.tournamentStatus & 0b110) {
      // game.tournamentStatus = game.tournamentStatus << 1;
      this.gameService.addToTournamentQueue(
        game.winningPlayer.socket,
        game.tournamentStatus,
      );
    }
  }

  matchStart(game: GameState) {
    if (game.user1 && game.user1.socket) {
      console.log(
        'GAME.GATEWAY: MATCHSTART, starting countdown for userid: ',
        game.user1.userData.id,
      );
      game.user1.socket.emit('countDown', game.currentCount);
    }
    if (game.user2 && game.user2.socket) {
      console.log(
        'GAME.GATEWAY: MATCHSTART, starting countdown for userid: ',
        game.user2.userData.id,
      );
      game.user2.socket.emit('countDown', game.currentCount);
    }
    console.log(`Countdown: ${game.currentCount}`);
  }
}
