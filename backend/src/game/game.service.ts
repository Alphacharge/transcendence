import { Injectable } from '@nestjs/common';
import { GameServiceInterface } from './game.service.interface';
import { GameGateway } from './gateway';

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
		const speedFactor = 4;
		const angle=this.randomAngle();
	  this.x = 500; // Initial X position
	  this.y = 250; // Initial Y position
	  this.speedX = speedFactor * Math.cos(angle); // Initial X speed
	  this.speedY = speedFactor * Math.sin(angle); // Initial Y speed
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
		return  angle; }

	}


@Injectable()
export class GameService implements GameServiceInterface {

	private ball: Ball;
	private paddle: Paddle;
	private field: Field;

	constructor(private readonly gameGateway: GameGateway) {
		this.ball = new Ball();
		this.paddle = new Paddle();
		this.field = new Field();
	}

	movePaddleUp() {
		// implement
	}
	movePaddleDown() {
		// implement
	}

	animateBall() {
		const ballLeft = this.ball.x - 5;
		const ballRight = this.ball.x + 5;
		const ballTop = this.ball.y - 5;
		const ballBottom = this.ball.y + 5;

		// Check for collision with square borders
		if (ballLeft <= 5 || ballRight >= this.field.width + 10) {
			console.log("Touched", ballLeft, ballRight, this.field.width);
			this.ball.speedX = -this.ball.speedX; // Reverse X direction
		}
		if (ballTop <=1 || ballBottom >= this.field.height + 9) {
			this.ball.speedY = -this.ball.speedY; // Reverse Y direction
		}

		// Calculate paddle boundaries
		const paddleLeft = 100; // Adjust this value based on your paddle's initial position
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
			console.log(ballTop, paddleBottom);
			this.ball.speedX = -this.ball.speedX;
		}

		// Update the ball's position
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;

		const ballCoordinates = { x: this.ball.x, y:this.ball.y}
		this.gameGateway.sendBallUpdate(ballCoordinates);
	}
}
