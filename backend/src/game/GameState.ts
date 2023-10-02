// GameState.ts
import { Socket } from "socket.io";

export class GameState {
	// Define properties to store game-related data
	gameId: string;

	player1: Socket;
	player2: Socket;
	scorePlayer1: number;
	scorePlayer2: number;

	ballX: number;
	ballY: number;
	ballSpeedX: number;
	ballSpeedY: number;

	leftPaddleX: number;
	leftPaddleY: number;
	rightPaddleX: number;
	rightPaddleY: number;

	fieldX: number;
	fieldY: number;

	constructor() {
		this.gameId = this.generateID();

		this.gameInit();
	}

	// creates a new game
	gameInit() {
		const speedFactor = 1;
		const angle=this.randomAngle();

		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;

		this.ballX = 400;
		this.ballY = 200;
		this.ballSpeedX = speedFactor * Math.cos(angle);
		this.ballSpeedY = speedFactor * Math.sin(angle);

		this.leftPaddleX = 40;
		this.leftPaddleY = 180;
		this.rightPaddleX = 760;
		this.rightPaddleY = 180;

		this.fieldX = 800;
		this.fieldY = 400;
	}

	// generates a random starting angle which is not orthogonal to any boundary
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

	// Define methods to update the game state
	updateBallPosition(newX: number, newY: number) {
	  this.ballX = newX;
	  this.ballY = newY;
	  // Handle collision logic, scoring, etc.
	  // ...
	}

	updatePaddlePosition(player: number, newY: number) {
		if (player === 1) {
		this.leftPaddleY = newY;
		} else if (player === 2) {
		this.rightPaddleY = newY;
		}
		// Handle collision logic, boundary checks, etc.
		// ...
	}

	generateID(): string {
		const	timestamp = Date.now();
		const	randomValue = Math.floor(Math.random() * 1000);

		const	id = `${timestamp}-${randomValue}`;
		return	id;
	}

	// Other methods and logic for the game state
	// ...
}
