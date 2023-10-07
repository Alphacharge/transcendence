// game.gateway.ts
import { sharedEventEmitter } from "./game.events";
import { GameState } from "./GameState"
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnModuleInit} from "@nestjs/common";
import { GameService } from "./game.service";

// can enter a port in the brackets
@WebSocketGateway()
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	private	games: Map<string, GameState> = new Map(); // Map to store games

	constructor(private readonly gameService: GameService) {
		sharedEventEmitter.on('ballPositionUpdate', (gameId: string) => {
			if (gameId)
				this.sendBallUpdate(gameId);
		});
	}

	/* New client connected. */
	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected');
		});
	}

	/* Client requests a new game. */
	@SubscribeMessage('newGame')
	newGame(@ConnectedSocket() socket: Socket) {
		console.log(`Received 'newGame' message from socket ID ${socket.id}`);

		this.startGame(socket);
	}

	/* Client requests to abort game. */
	@SubscribeMessage('stopGame')
	stopGame(@MessageBody() payload: { gameId: string }) {
		const game = this.games.get(payload.gameId);

		if (game)
		{
			// variable needed any more?
			// rbetz 7.10. needed to stop after game and redirect user to homescreen?
			if (game.user1)
				game.user1.inGame = false;

			// stop game loop
			if (game.intervalId) {
				clearInterval(game.intervalId);
				game.intervalId = null;
				console.log("Stopping game", game.gameId);
			}

			// remove the game from map
			// REMOVE this part if the game state is still needed
			this.games.delete(payload.gameId);
		}
	}

	startGame(socket: Socket) {
		// check if this socket is already running a game
		// REMOVE/adapt this check when users are implemented
		for (const game of this.games.values()) {
				if (game.user1.socket && game.user1.socket.id == socket.id) {
					console.error("Client already is in an active game.");
					return;
				}
				if (game.user2.socket && game.user2.socket.id == socket.id) {
					console.error("Client already is in an active game.");
					return;
				}
		}

		// create a new game
		const game = new GameState();
		game.user1.socket = socket;

		// add new game to games map
		this.games.set(game.gameId, game);
		// run game
		this.gameService.startGame(game);
		// send necessary info to client
		socket.emit('gameId', { gameId: game.gameId });
		this.sendPaddleUpdate(game.gameId);
	}

	// ball coordinate transmission
	sendBallUpdate(gameId: string) {
		const	game = this.games.get(gameId);

		game.user1.socket.emit('ballUpdate', game.ballCoordinates());
		// add other players
	}

	// update for both paddles
	sendPaddleUpdate(gameId: string) {
		const	game = this.games.get(gameId);

		game.user1.socket.emit('leftPaddle', game.leftPaddleY);
		game.user1.socket.emit('rightPaddle', game.rightPaddleY);
		// add other players
	}

	// listen for paddle updates
	@SubscribeMessage('leftPaddleUp')
	leftPaddleUp(@MessageBody() payload: { gameId: string }) {
		const game = this.games.get(payload.gameId);

		if (game && game.leftPaddleY > 10) {
			game.leftPaddleY -= 10;
			game.user1.socket.emit('leftPaddle', game.leftPaddleY);
			// add other players
		}
	}

	@SubscribeMessage('leftPaddleDown')
	leftPaddleDown(@MessageBody() payload: { gameId: string }) {
		const game = this.games.get(payload.gameId);

		if (game && game.leftPaddleY + 100 + 10 <400) {
			game.leftPaddleY += 10;
			game.user1.socket.emit('leftPaddle', game.leftPaddleY);
			// add other players
		}
	}
}

