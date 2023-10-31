import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto';

@Injectable()
export class GameState {
  gameId: string;
  intervalId: NodeJS.Timeout | null;

  user1: UserDto;
  user2: UserDto;
  scorePlayer1: number;
  scorePlayer2: number;

  ballRadius: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;

  leftPaddleX: number;
  leftPaddleY: number;
  leftPaddleLeft: number;
  leftPaddleRight: number;
  leftPaddleTop: number;
  leftPaddleBottom: number;

  rightPaddleX: number;
  rightPaddleY: number;
  rightPaddleLeft: number;
  rightPaddleRight: number;
  rightPaddleTop: number;
  rightPaddleBottom: number;

  fieldX: number;
  fieldY: number;
  fieldLeft: number;
  fieldRight: number;
  fieldTop: number;
  fieldBottom: number;

  constructor() {
    this.gameId = this.generateID();
    this.intervalId = null;

    this.user1 = null;
    this.user2 = null;

    this.gameInit();
  }

  /* Creates a new game with default values. */
  gameInit() {
    const speedFactor = 3;
    const angle = this.randomAngle();

    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0;

  this.ballRadius = 5;
    this.ballX = 400;
    this.ballY = 200;
    this.ballSpeedX = speedFactor * Math.cos(angle);
    this.ballSpeedY = speedFactor * Math.sin(angle);

    this.leftPaddleX = 40;
    this.leftPaddleY = 150;
	// paddle collision boundaries for ball: bigger than actual paddle
	this.leftPaddleLeft = this.leftPaddleX - this.ballRadius;
	this.leftPaddleRight = this.leftPaddleX + 10 + this.ballRadius;
	this.leftPaddleTop = this.leftPaddleY - this.ballRadius;
	this.leftPaddleBottom = this.leftPaddleY + 100 + this.ballRadius;

    this.rightPaddleX = 760;
    this.rightPaddleY = 150;
	this.rightPaddleLeft = this.rightPaddleX - this.ballRadius;
	this.rightPaddleRight = this.rightPaddleX + 10 + this.ballRadius;
	this.rightPaddleTop = this.rightPaddleY - this.ballRadius;
	this.rightPaddleBottom = this.rightPaddleY + 100 + this.ballRadius;

    this.fieldX = 800;
    this.fieldY = 400;
	// boundaries for the ball coordinates
	this.fieldLeft = 5 + this.ballRadius;
	this.fieldRight = this.fieldX - 15 - this.ballRadius;
	this.fieldTop = 5 + this.ballRadius;
	this.fieldBottom = this.fieldY - 15 - this.ballRadius;
  }

  /* Generates a random starting angle which is not orthogonal to any boundary. */
  randomAngle() {
    let p = Math.PI;
    let angle;
    do {
      angle = Math.random() * 2 * p;
      // repeat until computed value ca. +-10% away from horizontal and +-30% vertical axes
    } while (
      (angle > 1.4 && angle < 1.8) ||
      (angle > 4.5 && angle < 4.9)
    );
    console.log("angle ", angle);
    return angle;
  }

  /* Updates the ball coordinates. */
  updateBallPosition(newX: number, newY: number) {
    this.ballX = newX;
    this.ballY = newY;
  }

  /* Returns object with x and y coordinate.*/
  ballCoordinates() {
    return { x: this.ballX, y: this.ballY };
  }

  getScore() {
    return { player1: this.scorePlayer1, player2: this.scorePlayer2 };
  }

  /* Generates a random ID string. */
  generateID(): string {
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 1000);

    const id = `${timestamp}-${randomValue}`;
    return id;
  }

  movePaddleUp(playerNumber: number) {
	if (playerNumber == 1) {
		if (this.leftPaddleY > 10) {
			this.leftPaddleY -= 10;
			this.leftPaddleTop = this.leftPaddleY - this.ballRadius;
			this.leftPaddleBottom = this.leftPaddleY + 100 + this.ballRadius;
		}
	}
	else if (playerNumber == 2) {
		if (this.rightPaddleY > 10) {
			this.rightPaddleY -= 10;
			this.rightPaddleTop = this.rightPaddleY - this.ballRadius;
			this.rightPaddleBottom = this.rightPaddleY + 100 + this.ballRadius;
		}
	}
  }

  movePaddleDown(playerNumber: number) {
	if (playerNumber == 1) {
		if (this.leftPaddleY + 100 < this.fieldY - 10) {
			this.leftPaddleY += 10;
			this.leftPaddleTop = this.leftPaddleY - this.ballRadius;
			this.leftPaddleBottom = this.leftPaddleY + 100 + this.ballRadius;
		}
	}
	else if (playerNumber == 2) {
		if (this.rightPaddleY + 100 < this.fieldY - 10) {
			this.rightPaddleY += 10;
			this.rightPaddleTop = this.rightPaddleY - this.ballRadius;
			this.rightPaddleBottom = this.rightPaddleY + 100 + this.ballRadius;
		}
	}
  }

  ballInsideLeftPaddle() {
	if (this.ballX > this.leftPaddleLeft &&
		this.ballX < this.leftPaddleRight &&
		this.ballY > this.leftPaddleTop &&
		this.ballY < this.leftPaddleBottom) return true;
	return false;
  }

  ballInsideRightPaddle() {
	if (this.ballX > this.rightPaddleLeft && this.ballX < this.rightPaddleRight &&
		this.ballY > this.rightPaddleTop && this.ballY < this.rightPaddleBottom) return true;
	return false;
  }
}
