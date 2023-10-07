// game.gateway.ts
import { sharedEventEmitter } from "./game.events";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnModuleInit} from "@nestjs/common";
import { GameService } from "./game.service";
import { UserDto } from "src/user/dto";
import { GameState } from "./GameState";

// can enter a port in the brackets
@WebSocketGateway()
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	constructor(private readonly gameService: GameService) {
		sharedEventEmitter.on('ballPositionUpdate', (game: GameState) => {
			if (game)
				this.sendBallUpdate(game);
		});
    // sharedEventEmitter.on('gameStarted', (gameId: string) => {
    //   if (game)
    //     this.sendGameId(game);
    // });
    sharedEventEmitter.on('paddleUpdate', (game: GameState) => {
      this.sendPaddleUpdate(game);
    });
	}

	/* New client connected. */
	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected');

      // save new user to users array in GameService
		  const user = new UserDto();
      user.socket = socket;
      this.gameService.users.set(socket.id, user);
		});
	}

	/* Client requests a new game. */
	@SubscribeMessage('newGame')
	newGame(@ConnectedSocket() socket: Socket) {
		console.log(`Received 'newGame' message from socket ID ${socket.id}`);

    // possibly do this in gameservice
    let user = this.gameService.users.get(socket.id);
    if (!user) {
      console.error("User not found.");
      return;
    }
    if (user.inGame == true) {
      console.error("Client already is in an active game.");
      return;
    }

    // send answer to client
		let game = this.gameService.startGame(user);
    game.user1.socket.emit('gameId', { gameId: game.gameId });
    this.sendPaddleUpdate(game);
	}

	/* Client requests to abort game. */
	@SubscribeMessage('stopGame')
	stopGame(@MessageBody() payload: { gameId: string }) {
    if (payload)
      this.gameService.stopGame(payload.gameId);
	}

  sendGameId(game:GameState) {
    game.user1.socket.emit('gameId', { gameId: game.gameId });
  }

	// ball coordinate transmission
	sendBallUpdate(game: GameState) {
		game.user1.socket.emit('ballUpdate', game.ballCoordinates());
		// add other players
	}

	// update for both paddles
	sendPaddleUpdate(game: GameState) {
		game.user1.socket.emit('leftPaddle', game.leftPaddleY);
		game.user1.socket.emit('rightPaddle', game.rightPaddleY);
		// add other players
	}

	// listen for paddle updates
	@SubscribeMessage('leftPaddleUp')
	leftPaddleUp(@MessageBody() payload: { gameId: string }) {
    if (payload) {
      const game = this.gameService.leftPaddleUp(payload.gameId);
      if (game)
        game.user1.socket.emit('leftPaddle', game.leftPaddleY);
    }
	}

	@SubscribeMessage('leftPaddleDown')
	leftPaddleDown(@MessageBody() payload: { gameId: string }) {
    if (payload) {
      const game = this.gameService.leftPaddleDown(payload.gameId);
      if (game)
        game.user1.socket.emit('leftPaddle', game.leftPaddleY);
    }
	}
}

