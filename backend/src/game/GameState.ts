import { Injectable } from '@nestjs/common';
import { User } from 'src/user/User';
import { sharedEventEmitter } from './game.events';

@Injectable()
export class GameState {
  gameId: string;
  intervalId: NodeJS.Timeout | null;

  user1: User;
  user2: User;
  scorePlayer1: number;
  scorePlayer2: number;
  winningPlayer: String;
  winningScore: number;

  fieldWidth: number;
  fieldHeight: number;

  ballRadius: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;

  paddlesHeight: number;

  leftPosition: number;
  leftBorder: number;
  leftImpact: number

  rightPosition: number;
  rightBorder: number;
  rightImpact: number

  speedFactor: number;

  constructor() {
    this.gameId = this.generateID();
    this.intervalId = null;

    this.user1 = null;
    this.user2 = null;
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0;
    this.winningScore=11;

    this.fieldWidth = 800;
    this.fieldHeight = 400;

    this.speedFactor = 5;

    this.paddlesHeight = 1/4 * this.fieldHeight;
    const paddlesWidth = 1/160 * this.fieldWidth;
    const paddlesDistance = 1/20 * this.fieldWidth;
    const paddlesStartPosition = (this.fieldHeight - this.paddlesHeight) / 2;
    this.ballRadius = paddlesWidth;

    this.leftBorder = paddlesDistance;
    this.leftPosition = paddlesStartPosition;
    this.leftImpact = 0;

    this.rightBorder = this.fieldWidth - paddlesDistance;
    this.rightPosition = paddlesStartPosition;
    this.rightImpact = 0;

    this.gameInit();
  }

  gameInit() {
    const startAngle = this.randomAngle();
    this.ballX = this.fieldWidth / 2;
    this.ballY = this.fieldHeight / 2;
    this.ballSpeedX = this.speedFactor * Math.cos(startAngle);
    this.ballSpeedY = this.speedFactor * Math.sin(startAngle);
  }


  /* Generates a random starting startAngle which is not orthogonal to any boundary. */
  randomAngle() {
    let p = Math.PI;
    let startAngle: number;
    do {
      startAngle = Math.random() * 2 * p;
      // repeat until within acceptable startAngle range
    } while (
      (startAngle > 1.4 && startAngle < 1.8) ||
      (startAngle > 4.5 && startAngle < 4.9)
    );
    return startAngle;
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

  movePaddleUp(player: User) {
	if (player === this.user1) {
		if (this.leftPosition > 0) {
			this.leftPosition -= 10;
    }
	}
	else if (player === this.user2) {
		if (this.rightPosition > 10) {
			this.rightPosition -= 10;
		}
	}
  }

  movePaddleDown(player: User) {
	if (player === this.user1) {
		if (this.leftPosition + this.paddlesHeight < this.fieldHeight) {
			this.leftPosition += 10;
		}
	}
	else if (player === this.user2) {
		if (this.rightPosition + this.paddlesHeight < this.fieldHeight) {
			this.rightPosition += 10;
		}
	}
  }

  leftBreakthrough() {
    if(this.ballX <= this.ballRadius) {
      this.scorePlayer2 += 1;
      sharedEventEmitter.emit('scoreUpdate', this);
      this.gameInit();
    }
  }

  rightBreakthrough() {
    if(this.ballX >= this.fieldWidth - this.ballRadius) {
      this.scorePlayer1 += 1;
      sharedEventEmitter.emit('scoreUpdate', this);
      this.gameInit();
    }
  }

  collisionLeft() {
    const collisionAreaX0 = this.leftBorder;
    const collisionAreaX1 = this.leftBorder + 2 * this.ballRadius;
    const collisionAreaY0 = Math.min(this.leftPosition, this.leftPosition - 2 * this.ballRadius);
    const collisionAreaY1 = Math.min(this.leftPosition + this.paddlesHeight, this.fieldHeight);
    if (this.ballX > collisionAreaX0 && this.ballX < collisionAreaX1
      && this.ballY > collisionAreaY0 && this.ballY < collisionAreaY1) {
        const distance = Math.max(this.ballY - this.leftPosition,0);
        const angle = this.impact(distance);
        this.ballSpeedX = this.speedFactor * Math.cos(angle);
        this.ballSpeedY = this.speedFactor * Math.sin(angle);
    }
  }

  collisionRight() {
    const collisionAreaX0 = this.rightBorder - 2 * this.ballRadius;
    const collisionAreaX1 = this.rightBorder;
    const collisionAreaY0 = Math.min(this.rightPosition, this.rightPosition - 2 * this.ballRadius);
    const collisionAreaY1 = Math.min(this.rightPosition + this.paddlesHeight, this.fieldHeight);
    if (this.ballX > collisionAreaX0 && this.ballX < collisionAreaX1
      && this.ballY > collisionAreaY0 && this.ballY < collisionAreaY1) {
      const distance = Math.max(this.ballY - this.rightPosition,0);
      const angle = this.impact(distance);
      this.ballSpeedX = - this.speedFactor * Math.cos(angle);
      this.ballSpeedY = this.speedFactor * Math.sin(angle);
    }
  }

  collisionTop() {
    if (this.ballY <= this.ballRadius) {
      return true;
    }
    return false;
  }

  collisionBottom() {
    if (this.ballY >= this.fieldHeight - this.ballRadius){
      return true;
    }
    return false;
  }

  collisionField() {
    if (this.collisionTop() || this.collisionBottom()) {
      this.ballSpeedY = -this.ballSpeedY
    }
  }

  impact(distance: number) {
    const p = Math.PI;
    const angle = p / (2 * this.paddlesHeight) * distance - p / 4;
    return angle;
  }

  playerVictory () {
    if (this.scorePlayer1 == this.winningScore || this.scorePlayer2 == this.winningScore) {
      clearInterval(this.intervalId);
      this.intervalId = null
      this.gameInit();
      if (this.scorePlayer1 ==  this.winningScore)
        this.winningPlayer = "Player 1";
      else
        this.winningPlayer = "Player 2";
      sharedEventEmitter.emit('victory', this);
    }
  }
  isRunning(): boolean {
    return this.intervalId !== null;
  }
}
