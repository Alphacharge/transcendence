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
import { TournamentState } from './TournamentState';

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
      if (game) this.sendPrepareGame(game);
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
    sharedEventEmitter.on('addedToTournamentQueue', (user: User) => {
      this.addedToTournamentQueue(user);
      this.sendTournamentQueueLength();
    });
    sharedEventEmitter.on('removedFromTournamentQueue', (user: User) => {
      this.removedFromTournamentQueue(user);
      this.sendTournamentQueueLength();
    });
    sharedEventEmitter.on('tournamentStart', (tournament: TournamentState) => {
      this.tournamentStart(tournament);
    });
  }

  /* New client connected. */
  async handleConnection(socket: any) {
    console.log('handleConnection: Client connected sid: ', socket.id);

    const isValid = await this.authService.validateToken(
      socket.handshake.query.token,
    );
    if (isValid) {
      // save new user to users array in GameService
      const user = new User();

      user.socket = socket;
      user.userData = await this.prismaService.getUserById(
        socket.handshake.query.userId,
      );
      this.gameService.websocketUsers.set(socket.id, user);
      if (!user.userData) {
        console.log('handleConnection: User not found in database.');
      }
    } else {
      console.log('handleConnection: Refusing WebSocket connection.');
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: any) {
    console.log('handleDisconnect: Client disconnected sid:', socket.id);

    // get the right user
    const user = this.gameService.websocketUsers.get(socket.id);

    if (user) {
      // remove user from any queues
      this.gameService.removeFromQueue(socket);
      this.gameService.removeFromTournamentQueue(socket);

      // if (user.activeGame) {
      // this.gameService.stopGame(user.activeGame);
      // }
    }
    // remove from list of active users
    // this.gameService.websocketUsers.delete(socket.id);
  }

  @SubscribeMessage('startLocalGame')
  startLocalGame(@ConnectedSocket() socket: Socket) {
    this.gameService.startLocalGame(socket);
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

  @SubscribeMessage('requestTournamentInfo')
  sendTournamentInfo(@ConnectedSocket() socket: Socket) {
    this.sendTournamentQueueLength();
    this.sendTournamentQueue(socket);
  }

  sendTournamentQueueLength() {
    this.server.emit(
      'tournamentPlayerCount',
      this.gameService.queueTournament.length,
    );
  }

  sendTournamentQueue(socket: Socket) {
    if (socket) {
      this.gameService.queueTournament.forEach((queuedUser) => {
        socket.emit('playerJoinedTournament', queuedUser.userData.username);
      });
    } else {
      this.gameService.queueTournament.forEach((queuedUser) => {
        this.gameService.queueTournament.forEach((queuedSocket) => {
          queuedSocket.socket.emit(
            'playerJoinedTournament',
            queuedUser.userData.username,
          );
        });
      });
    }
  }

  /* Tell the client the game starts now. */
  sendGameStart(game: GameState) {
    game.user1.socket.emit('start');
    if (game.user2) game.user2.socket.emit('start');
  }

  /* Prepare the client for the game. */
  sendPrepareGame(game: GameState) {
    // tell the client the player number
    game.user1.socket.emit('player1');
    if (game.user2) game.user2.socket.emit('player2');
    // send game info here?
    this.sendPaddleUpdate(game);
    this.sendBallUpdate(game);
    this.sendScoreUpdate(game);
  }

  // ball coordinate transmission
  sendBallUpdate(game: GameState) {
    game.user1.socket.emit('ballUpdate', game.ballCoordinates());
    if (game.user2)
      game.user2.socket.emit('ballUpdate', game.ballCoordinates());
  }

  sendScoreUpdate(game: GameState) {
    game.user1.socket.emit('scoreUpdate', game.getScore());
    if (game.user2) game.user2.socket.emit('scoreUpdate', game.getScore());
  }

  // update for both paddles
  sendPaddleUpdate(game: GameState) {
    game.user1.socket.emit('leftPaddle', game.leftPosition);
    game.user1.socket.emit('rightPaddle', game.rightPosition);
    if (game.user2) {
      game.user2.socket.emit('leftPaddle', game.leftPosition);
      game.user2.socket.emit('rightPaddle', game.rightPosition);
    }
  }

  // listen for paddle updates
  @SubscribeMessage('paddleUp')
  PaddleUp(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { localPlayer: string },
  ) {
    const user = this.gameService.websocketUsers.get(socket.id);
    if (user) {
      const game = this.gameService.paddleUp(user, payload.localPlayer);
      if (game) this.sendPaddleUpdate(game);
    }
  }

  @SubscribeMessage('paddleDown')
  PaddleDown(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { localPlayer: string },
  ) {
    const user = this.gameService.websocketUsers.get(socket.id);
    const game = this.gameService.paddleDown(user, payload.localPlayer);
    if (game) this.sendPaddleUpdate(game);
  }

  announceVictory(game: GameState) {
    if (game.isLocalGame) {
      if (game.winningPlayer) {
        game.user1.socket.emit('victory', "Player 1");
      } else {
        game.user1.socket.emit('victory', "Player 2");
      }
    } else {
      game.user1.socket.emit('victory', game.winningPlayer.userData.username);
      game.user2.socket.emit('victory', game.winningPlayer.userData.username);
    }
  }

  matchStart(game: GameState) {
    if (game.user1 && game.user1.socket) {
      game.user1.socket.emit('countDown', game.currentCount);
    }
    if (game.user2 && game.user2.socket) {
      game.user2.socket.emit('countDown', game.currentCount);
    }
    console.log(`Countdown: ${game.currentCount}`);
  }

  addedToTournamentQueue(user: User) {
    user.socket.emit('addedToTournamentQueue');
    this.sendTournamentInfo(null);
  }

  removedFromTournamentQueue(user: User) {
    this.gameService.queueTournament.forEach((queuedUser) => {
      this.gameService.queueTournament.forEach((queuedSocket) => {
        queuedSocket.socket.emit(
          'playerLeftTournament',
          queuedUser.userData.username,
        );
      });
    });
    user.socket.emit('removedFromTournamentQueue');
  }

  tournamentStart(tournament: TournamentState) {
    tournament.players.forEach((user) => {
      user.socket.emit('tournamentStart');
    });
  }
}
