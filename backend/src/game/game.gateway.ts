// game.gateway.ts
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { OnModuleInit} from "@nestjs/common";
import { EventEmitter } from "stream";

class Field {
	width:number;
	height:number;
	constructor() {
		this.width = 800;
		this.height = 400;
	}
}

class Paddle {
	x:number;
	y:number;
	constructor() {
		this.x = 40;
		this.y = 180;
	}
}

class Ball {
	x: number;
	y: number;
	speedX: number;
	speedY: number;

	constructor() {
	}
}

// can enter a port in the brackets
@WebSocketGateway()
export class GameGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	private ball: Ball;
	private paddle: Paddle;
	private field: Field;
	private intervalId: NodeJS.Timeout | null = null;
	private kickOff: boolean;

	private eventEmitter = new EventEmitter();

	constructor() {
		this.kickOff  = false;
		this.ball = new Ball();
		this.paddle = new Paddle();
		this.field = new Field();

		this.eventEmitter.on('ballPositionUpdate', this.sendBallUpdate.bind(this));
		}

	gameInit() {
		const speedFactor = 1;
		const angle=this.randomAngle();
		this.ball.x = 400; // Initial X position
		this.ball.y = 200; // Initial Y position
		this.ball.speedX = speedFactor * Math.cos(angle); // Initial X speed
		this.ball.speedY = speedFactor * Math.sin(angle); // Initial Y speed
		// Add other properties and methods as needed
	}
	randomAngle() {
		let angle = 0;
		let p = Math.PI;
		// let angle = pi/2;
		do {
			angle = Math.random() * 2 * p;
			// repeat until computed value ca. +-10% away from horizontal and +-30% vertical axes
		  } while (angle < 0.1 * p || (angle > 0.9 * p && angle<1.1 * p) || angle > 1.9 * p || (angle > .7 * p / 2 && angle < 1.3 * p / 2) || (angle >.7 * 3/2*p&&angle < 1.3*3/2*p));
		  return  angle;
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected');

			this.gameInit();

			const updateRate = 1000 / 60; // 60 updates per second
			if(!this.kickOff) {
				this.kickOff = true;
				this.intervalId = setInterval(() => {
					this.animateBall();
				}, updateRate);
			}
		});
	}

	onModuleDestroy() {
		if(this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	animateBall() {
		const ballLeft = this.ball.x - 5;
		const ballRight = this.ball.x + 5;
		const ballTop = this.ball.y - 5;
		const ballBottom = this.ball.y + 5;

		// Check for collision with square borders
		if (ballLeft <= 5 || ballRight >= this.field.width + 10) {
			this.ball.speedX = -this.ball.speedX; // Reverse X direction
		}
		if (ballTop <=1 || ballBottom >= this.field.height + 9) {
			this.ball.speedY = -this.ball.speedY; // Reverse Y direction
		}
		// Calculate paddle boundaries
		const paddleLeft = 40; // Adjust this value based on your paddle's initial position
		const paddleRight = paddleLeft + 10; // Paddle width
		const paddleTop = this.paddle.y;
		const paddleBottom = this.paddle.y + 100; // Paddle height

		// Check for collision with the paddle
		if (
			ballRight > paddleLeft -5 &&
			ballLeft < paddleRight - 5 &&
			ballBottom > paddleTop &&
			ballTop < paddleBottom - 5
		) {
			this.ball.speedX = -this.ball.speedX;
		}

		// Update the ball's position
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;
		const ballCoordinates = { x: this.ball.x, y:this.ball.y}
		// console.log("ball calculated");
		this.eventEmitter.emit('ballPositionUpdate', ballCoordinates);
	}

	// newMessage event
	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log('NewMessage:', body);
		this.server.emit('onMessage', {
			msg: 'New Message',
			content: body,
		});
	}

	// listen for paddle updates
	@SubscribeMessage('leftPaddleUp')
	leftPaddleUp() {
		this.paddle.y-=10;
		this.server.emit('leftPaddleUp', this.paddle.y);
		// this.eventEmitter.emit('leftPaddleUp');
	}

	@SubscribeMessage('leftPaddleDown')
	leftPaddleDown() {
		this.paddle.y +=10;
		this.server.emit('leftPaddleDown', this.paddle.y);
		// this.eventEmitter.emit('leftPaddleDown');
	}

	// ball coordinate transmission
	sendBallUpdate(ballCoordinates: { x: number; y: number }) {
		// console.log("Ball updated");
		this.server.emit('ballUpdate', ballCoordinates);
	}
}

