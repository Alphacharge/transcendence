// game.service.ts
import { clearInterval } from 'timers';
import { sharedEventEmitter } from './game.events';
import { GameState } from './GameState';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/User';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  queueTournamentGame: User[] = [];
  queue: User[] = [];
  users: Map<string, User> = new Map(); //socket.id -> user
  games: Map<number, GameState> = new Map(); // gamestate.gameid -> gamestate

  /* A new user is added to the game queue */
  addToQueue(socket: Socket) {
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
      console.log('GAME.SERVICE: ADDTOQUEUE, Client is already playing');
      return;
    }

    console.log(
      `GAME.SERVICE: ADDTOQUEUE, Client ${socket.id} entered game queue`,
    );
    this.queue.push(user);
    // check if a game is ready to be started
    this.checkQueue();
  }

  addToTournamentQueue(socket: Socket, tournamentStatus: number) {
    const user = this.users.get(socket.id);

    if (!user) {
      console.error(`ADDTOTOURNAMENTQUEUE: User ${socket.id} not found.`);
      return;
    }
    this.queueTournamentGame.push(user);

    console.log(
      `GAME.SERVICE: ADDTOTOURNAMENTQUEUE, Client ${socket.id} entered tournament queue, tournament status ${tournamentStatus}`,
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
        console.log(
          `GAME.SERVICE: REMOVEFROMQUEUE, Client: ${socket.id} removed from game queue`,
        );
      }
    }
  }

  removeFromTournamentQueue(socket: Socket) {
    const user = this.users.get(socket.id);

    const userToRemove = this.queueTournamentGame.find(
      (queuedUser) => queuedUser.userData.id === user.userData.id,
    );
    if (userToRemove) {
      const index = this.queueTournamentGame.indexOf(userToRemove);
      if (index !== -1) {
        this.queueTournamentGame.splice(index, 1);
        console.log(
          `removeFromTournamentQueue: ${socket.id} removed from tournament queue`,
        );
      }
    }
  }

  checkQueue() {
    if (this.queue.length >= 2) {
      console.log(
        'GAME.SERVICE: CHECKQUEUE, queuelength is',
        this.queue.length,
      );

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

    if (!user1 || !user2) {
      console.log('startGame: User disconnected. Aborting game.');
      return;
    }

    const game = new GameState(user1, user2, this.prismaService);
    game.tournamentStatus = tournamentStatus;
    // if (tournamentStatus) {
    //   const tournament: Tournaments = await this.prisma.tournaments.create({
    //     data: {
    //       first_game_id: game.GameData.id,
    //     },
    //   });
    // }
    await game.countDown();
    game.GameData = await this.prismaService.createNewGame(
      game.user1.userData.id,
      game.user2.userData.id,
    );

    if (!game.GameData) {
      console.log(
        'GAME.SERVICE: STARTGAME, Failed to create new Game!',
        this.queue.length,
      );
      return;
    }
    if (game.tournamentStatus) {
      // You can handle the result or perform other actions based on the Prisma query result
      console.log(
        'GAME.STATE: INITIALIZEGAME, New game created:',
        game.GameData,
      );
      if (game.tournamentStatus & 2) {
        console.log('GAME.STATE: INITIALIZEGAME, Tournament first round');
      }
      if (game.tournamentStatus & 4) {
        console.log('GAME.STATE: INITIALIZEGAME, Tournament second round');
      }
    }
    const updateRate = 5;

    game.user1.activeGame = game;
    game.user2.activeGame = game;

    this.games.set(game.GameData.id, game);
    sharedEventEmitter.emit('prepareGame', game);

    console.log(
      'GAME.SERVICE: STARTGAME, Starting multiplayer game',
      game.GameData.id,
    );
    game.intervalId = setInterval(() => {
      this.animateBall(game);
    }, updateRate);
    sharedEventEmitter.emit('startGame', game);
  }

  stopGame(game: GameState) {
    if (!game) {
      console.error("GAME.SERVICE: STOPGAME, Couldn't stop. Game not found.");
      return;
    }

    console.log('GAME.SERVICE: STOPGAME, Stopping game', game.GameData.id);
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
