// game.service.ts
import { EventEmitter } from 'stream';
import { GameState } from './GameState';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
	private	eventEmitter = new EventEmitter();
	private	intervalId: NodeJS.Timeout | null = null; // should be moved into GameState
	private	kickOff: boolean; // fix for only starting one game loop ever

	constructor() {
		this.kickOff = false;

		this.eventEmitter.on('newGame', (gameState: GameState) => {
			console.log("received internal event");
			this.startGame(gameState);
		});

		// NOT WORKING
		// GameService needs to be injected somewhere
		// but i don't know where and when
		console.log("GameService initialized");
	}

	startGame(gameState: GameState) {
		const	updateRate = 1000 / 60; // 60 updates per second

		console.log("starting game");
		if(!this.kickOff) {

			console.log("starting loop");

			this.kickOff = true;
			this.intervalId = setInterval(() => {
				this.animateBall(gameState);
			}, updateRate);
		}
	}

	animateBall(game: GameState) {
		const ballLeft = game.ballX - 5;
		const ballRight = game.ballX + 5;
		const ballTop = game.ballY - 5;
		const ballBottom = game.ballY + 5;

		// Check for collision with square borders
		if (ballLeft <= 5 || ballRight >= game.fieldX + 10) {
			game.ballSpeedX = -game.ballSpeedX; // Reverse X direction
		}
		if (ballTop <= 1 || ballBottom >= game.fieldY + 9) {
			game.ballSpeedY = -game.ballSpeedY; // Reverse Y direction
		}
		// Calculate paddle boundaries
		const paddleLeft = 40; // Adjust this value based on your paddle's initial position
		const paddleRight = paddleLeft + 10; // Paddle width
		const paddleTop = game.leftPaddleY;
		const paddleBottom = game.leftPaddleY + 100; // Paddle height

		// Check for collision with the paddle
		if (
			ballRight > paddleLeft -5 &&
			ballLeft < paddleRight - 5 &&
			ballBottom > paddleTop &&
			ballTop < paddleBottom - 5
		) {
			game.ballSpeedX = -game.ballSpeedX;
		}

		// Update the ball's position
		game.ballX += game.ballSpeedX;
		game.ballY += game.ballSpeedY;

		console.log("calculated ball");
		this.eventEmitter.emit('ballPositionUpdate', game.gameId);
	}
}
