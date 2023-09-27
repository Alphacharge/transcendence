//gateway.ts
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Injectable, OnModuleInit} from "@nestjs/common";
import { GameServiceInterface } from "./game.service.interface";

// can enter a port in the brackets
@WebSocketGateway()
@Injectable()
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	constructor(private readonly gameService: GameServiceInterface) {} // Inject the GameService

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected');
		});
	}

	// newMessage event
	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log('NewMessage:', body);
		this.server.emit('onMessage', {
			msg: 'New Message',
			content: body,
		})
	}

	// ball coordinate transmission
	sendBallUpdate(ballCoordinates: { x: number; y: number }) {
		this.server.emit('ballUpdate', ballCoordinates);
	}

  @SubscribeMessage('movePaddleUp')
  handleMovePaddleUp() {
		this.gameService.movePaddleUp();
  }

  @SubscribeMessage('movePaddleDown')
  handleMovePaddleDown() {
	this.gameService.movePaddleDown();
  }
}
