import { Injectable } from "@nestjs/common";
import { UserDto } from "../user/dto";

@Injectable()
export class GameState {

	gameId: string;
	intervalId: NodeJS.Timeout | null;

	user1: UserDto;
	user2: UserDto;
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
		this.intervalId = null;

		this.user1 = new UserDto;
		this.user1.inGame = true;
		this.user1.socket = null;

		this.user2 = new UserDto;
		this.user2.inGame = true;
		this.user2.socket = null;

		this.gameInit();
	}

	/* Creates a new game with default values. */
	gameInit() {
		const speedFactor = 3;
		const angle=this.randomAngle();

		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;

		this.ballX = 400;
		this.ballY = 200;
		this.ballSpeedX = speedFactor * Math.cos(angle);
		this.ballSpeedY = speedFactor * Math.sin(angle);

		this.leftPaddleX = 40;
		this.leftPaddleY = 150;
		this.rightPaddleX = 760;
		this.rightPaddleY = 150;

		this.fieldX = 800;
		this.fieldY = 400;
	}

	/* Generates a random starting angle which is not orthogonal to any boundary. */
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

	/* Updates the ball coordinates. */
	updateBallPosition(newX: number, newY: number) {
		this.ballX = newX;
		this.ballY = newY;
	}

		/* Returns object with x and y coordinate.*/
		ballCoordinates() {
			return ({x: this.ballX, y: this.ballY});
		}

	/* Updates the paddle position. Player 1 left, Player 2 right.*/
	updatePaddlePosition(player: number, newY: number) {
		if (player === 1)
			this.leftPaddleY = newY;
		else if (player === 2)
			this.rightPaddleY = newY;
	}

	/* Generates a random ID string. */
	generateID(): string {
		const	timestamp = Date.now();
		const	randomValue = Math.floor(Math.random() * 1000);

		const	id = `${timestamp}-${randomValue}`;
		return	id;
	}
}
