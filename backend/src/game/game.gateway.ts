// game.gateway.ts
import { EventEmitter } from "stream";
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

	private eventEmitter = new EventEmitter();

	constructor(private readonly gameService: GameService) {
		this.eventEmitter.on('ballPositionUpdate', (gameId: string) => {
			this.sendBallUpdate(gameId);
		});
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected');
		});
	}

	// start a new game event from frontend
	@SubscribeMessage('newGame')
	onNewMessage(@ConnectedSocket() socket: Socket) {
		console.log(`Received 'newGame' message from socket ID ${socket.id}`);

		this.startGame(socket);
	}

	startGame(socket: Socket) {
		const	gameState = new GameState();
		gameState.player1 = socket;
		this.games.set(gameState.gameId, gameState);

		console.log("sending new game event");
		// send event to GameService
		this.eventEmitter.emit('newGame', gameState);
		// send info to client
		socket.emit('gameId', { gameId: gameState.gameId });
	}

	// ball coordinate transmission
	sendBallUpdate(gameId: string) {
		const game = this.games[gameId];

		console.log("sending ball update");
		game.player1.emit('ballUpdate', game.ballCoordinates());
	}

	// listen for paddle updates
	@SubscribeMessage('leftPaddleUp')
	leftPaddleUp(@MessageBody() payload: { gameId: string }) {
		const game = this.games.get(payload.gameId);

		if (game) {
			console.log("updated paddle");
			game.leftPaddleY -= 10;
			game.player1.emit('leftPaddleUp', game.leftPaddleY);
		}
	}

	@SubscribeMessage('leftPaddleDown')
	leftPaddleDown(@MessageBody() payload: { gameId: string }) {
		const game = this.games.get(payload.gameId);

		if (game) {
			game.leftPaddleY += 10;
			game.player1.emit('leftPaddleUp', game.leftPaddleY);
		}
	}
}

