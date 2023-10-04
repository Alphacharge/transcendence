// game.service.ts
import { clearInterval } from 'timers';
import { sharedEventEmitter } from './game.events';
import { GameState } from './GameState';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
	constructor() {}

	startGame(game: GameState) {
		const	updateRate = 1000 / 60; // 60 updates per second

		console.log("Starting game", game.gameId);

		game.intervalId = setInterval(() => {
			if (game.running) {
				this.animateBall(game);
			}
			else {
				console.log("Stopping game", game.gameId);
				clearInterval(game.intervalId);
				game.intervalId = null;
			}
		}, updateRate);
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

		sharedEventEmitter.emit('ballPositionUpdate', game.gameId);
	}
}
