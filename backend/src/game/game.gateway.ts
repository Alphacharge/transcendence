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
import { use } from 'passport';

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
    // sharedEventEmitter.on('startGame', (game: GameState) => {
    //   if (game) this.sendGameStart(game);
    // });
    sharedEventEmitter.on('ballPositionUpdate', (game: GameState) => {
      if (game) {
        this.sendBallUpdate(game);
      this.sendPaddleUpdate(game);
      }
    });
    sharedEventEmitter.on('scoreUpdate', (game: GameState) => {
      if (game) this.sendScoreUpdate(game);
    });
    // sharedEventEmitter.on('paddleUpdate', (game: GameState) => {
    //   this.sendPaddleUpdate(game);
    // });
    sharedEventEmitter.on('victory', (game: GameState) => {
      this.announceVictory(game);
    });
    sharedEventEmitter.on('tournamentWinner', (game: GameState) => {
      this.tournamentWinner(game);
    });
    sharedEventEmitter.on('countDown', (game: GameState) => {
      this.matchStart(game);
    });
    sharedEventEmitter.on('addedToTournamentQueue', (user: User) => {
      this.addedToTournamentQueue(user);
    });
    sharedEventEmitter.on('removedFromTournamentQueue', (user: User) => {
      this.removedFromTournamentQueue(user);
    });
    sharedEventEmitter.on('addedToQueue', (user: User) => {
      this.addedToQueue(user);
    });
    sharedEventEmitter.on('removedFromQueue', (user: User) => {
      this.removedFromQueue(user);
    });
    sharedEventEmitter.on('tournamentStart', (tournament: TournamentState) => {
      this.tournamentStart(tournament);
    });
  }

  /* New client connected. */
  async handleConnection(socket: any) {
    console.log('handleConnection: Client connected sid: ', socket?.id);

    const isValid = await this.authService.validateToken(
      socket?.handshake.query.token,
    );
    if (isValid) {
      // save new user to users array in GameService
      const user = new User();

      user.userData = await this.prismaService.getUserById(
        socket?.handshake.query.userId,
      );
      user.socket = socket;
      this.gameService.websocketUsers.set(socket?.id, user);
      if (!user.userData) {
        console.log('handleConnection: User not found in database.');
        socket?.disconnect(true);
      }
    } else {
      console.log('handleConnection: Refusing WebSocket connection.');
      socket?.disconnect(true);
    }
  }

  handleDisconnect(socket: any) {
    console.log('handleDisconnect: Client disconnected sid:', socket?.id);

    // get the right user
    const user = this.gameService.websocketUsers.get(socket?.id);

    if (user) {
      // remove user from any queues
      this.gameService.removeFromQueue(socket);
      this.gameService.removeFromTournamentQueue(socket);
    }
    // remove from list of active users
    this.gameService.websocketUsers.delete(socket?.id);
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
  requestTournamentInfo(@ConnectedSocket() socket: Socket) {
    socket?.join('tournamentWatchers'); // socket room of people on the tournament site
    this.sendTournamentInfo();
  }

  sendTournamentInfo() {
    this.server
      .to('tournamentWatchers')
      .emit('tournamentPlayerCount', this.gameService.queueTournament.length);

    this.gameService.queueTournament.forEach((queuedUser) => {
      this.server.to('tournamentWatchers').emit('playerJoinedTournament', {
        id: queuedUser.userData.id,
        nickname: queuedUser.userData.nickname,
        avatar: {
          id: queuedUser.userData.avatar.id,
          mime_type: queuedUser.userData.avatar.mime_type,
        },
      });
    });
  }

  /* Tell the client the game starts now. */
  // sendGameStart(game: GameState) {
  //   game.user1?.socket?.emit('start');
  //   game.user2?.socket?.emit('start');
  // }

  /* Prepare the client for the game. */
  sendPrepareGame(game: GameState) {
    // tell the client the player number

    const playerList = [];
    playerList.push({
      id: game.user1.userData.id,
      nickname: game.user1.userData.nickname,
      avatar: {
        id: game.user1.userData.avatar.id,
        mime_type: game.user1.userData.avatar.mime_type,
      },
    });

    if (game.user2) {
      playerList.push({
        id: game.user2.userData.id,
        nickname: game.user2.userData.nickname,
        avatar: {
          id: game.user2.userData.avatar.id,
          mime_type: game.user2.userData.avatar.mime_type,
        },
      });
      game.user2.socket?.emit('player2', playerList);
      game.user2.socket?.emit('prepareGame');
    }
    game.user1.socket?.emit('player1', playerList);
    game.user1.socket?.emit('prepareGame');
    // send game info here?
    this.sendPaddleUpdate(game);
    this.sendBallUpdate(game);
    this.sendScoreUpdate(game);
  }

  // ball coordinate transmission
  sendBallUpdate(game: GameState) {
    game.user1?.socket?.emit('ballUpdate', game.ballCoordinates());
    game.user2?.socket?.emit('ballUpdate', game.ballCoordinates());
  }

  sendScoreUpdate(game: GameState) {
    game.user1?.socket?.emit('scoreUpdate', game.getScore());
    game.user2?.socket?.emit('scoreUpdate', game.getScore());
  }

  // update for both paddles
  sendPaddleUpdate(game: GameState) {
    game.user1?.socket?.emit('leftPaddle', game.leftPosition);
    game.user1?.socket?.emit('rightPaddle', game.rightPosition);
    game.user2?.socket?.emit('leftPaddle', game.leftPosition);
    game.user2?.socket?.emit('rightPaddle', game.rightPosition);
  }

  // listen for paddle updates
  @SubscribeMessage('paddleUp')
  PaddleUp(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { localPlayer: boolean },
  ) {
    const user = this.gameService.websocketUsers.get(socket?.id);
    const game = user?.activeGame;
    if (!user || !game) return;

    if (user == game.user1 && !payload.localPlayer) {
      user.activeGame.leftMovement = 1;
    } else {
      user.activeGame.rightMovement = 1;
    }
  }

  @SubscribeMessage('paddleDown')
  PaddleDown(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { localPlayer: boolean },
  ) {
    const user = this.gameService.websocketUsers.get(socket?.id);
    const game = user?.activeGame;
    if (!user || !game) return;

    if (user == game.user1 && !payload.localPlayer) {
      game.leftMovement = 2;
    } else {
      game.rightMovement = 2;
    }
  }

  @SubscribeMessage('paddleUpStop')
  PaddleUpStop(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { localPlayer: boolean },
  ) {
    const user = this.gameService.websocketUsers.get(socket?.id);
    const game = user?.activeGame;
    if (!user || !game) return;

    if (user == game.user1 && !payload.localPlayer) {
      game.leftMovement = 0;
    } else {
      game.rightMovement = 0;
    }
  }

  @SubscribeMessage('paddleDownStop')
  PaddleDownStop(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { localPlayer: boolean },
  ) {
    const user = this.gameService.websocketUsers.get(socket?.id);
    const game = user?.activeGame;
    if (!user || !game) return;

    if (user == game.user1 && !payload.localPlayer) {
      game.leftMovement = 0;
    } else {
      game.rightMovement = 0;
    }
  }

  announceVictory(game: GameState) {
    if (game.isLocalGame) {
      if (game.winningPlayer) {
        game.user1.socket?.emit('victory', '1');
      } else {
        game.user1.socket?.emit('victory', '2');
      }
    } else {
      // if this is a tournament, inform each participant about the win
      if (game.tournamentState) {
        // added loser visualization for tournaents
        let loser = game.user1;
        if (game.winningPlayer == game.user1) loser = game.user2;

        game.tournamentState.players.forEach((player) => {
          player.socket?.emit('victoryOf', game.winningPlayer.userData.nickname);
          player.socket?.emit('lossOf', loser.userData.nickname);
        });
      }
      // tell the participants of the game who won
      game.user1.socket?.emit('victory', game.winningPlayer.userData.nickname);
      game.user2.socket?.emit('victory', game.winningPlayer.userData.nickname);
    }
  }

  tournamentWinner(game: GameState) {
    game.tournamentState.players.forEach((player) => {
      player.socket?.emit(
        'tournamentWinner',
        game.winningPlayer.userData.nickname,
      );
    });
  }

  matchStart(game: GameState) {
    game.user1?.socket?.emit('countDown', game.currentCount);
    game.user2?.socket?.emit('countDown', game.currentCount);
  }

  addedToTournamentQueue(user: User) {
    user.socket?.emit('addedToTournamentQueue');
    this.sendTournamentInfo();
  }

  removedFromTournamentQueue(user: User) {
    user.socket?.emit('removedFromTournamentQueue'); // tells the user they are not queued
    this.server
      .to('tournamentWatchers')
      .emit('playerLeftTournament', user.userData.id); // informs all clients someone left the queue
    this.sendTournamentInfo();
  }

  tournamentStart(tournament: TournamentState) {
    tournament.players.forEach((user) => {
      user.socket?.emit('tournamentStart');
    });

    // tell the watchers to empty the tournament queue
    this.server.to('tournamentWatchers').emit('tournamentReset');
  }

  addedToQueue(user: User) {
    user?.socket?.emit('addedToQueue');
  }

  removedFromQueue(user: User) {
    user?.socket?.emit('removedFromQueue');
  }
}
