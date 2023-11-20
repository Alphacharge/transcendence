import { Injectable } from '@nestjs/common';
import { User } from 'src/user/User';
import { sharedEventEmitter } from './game.events';
import { GameService } from './game.service';
import { Games, PrismaClient } from '@prisma/client';

@Injectable()
export class GameState {
  prisma: PrismaClient;
  GameData: Games | undefined = undefined;
  intervalId: NodeJS.Timeout | null;
  intervalCountId: NodeJS.Timeout | null;


  tournamentStatus: number;

  user1: User;
  user2: User;
  scorePlayer1: number;
  scorePlayer2: number;
  winningPlayer: User;
  winningScore: number;

  fieldWidth: number;
  fieldHeight: number;

  ballRadius: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  ballAcceleration: number;

  paddlesHeight: number;

  paddlesSpeed: number;

  leftPosition: number;
  leftBorder: number;
  leftImpact: number;

  rightPosition: number;
  rightBorder: number;
  rightImpact: number;

  speedFactor: number;

  currentCount: number;

  constructor(user1: User, user2: User) {
    this.prisma = new PrismaClient();
    this.GameData = null;
    this.intervalId = null;

    this.user1 = user1;
    this.user2 = user2;
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0;
    this.winningScore=11; // normal is 11, set to 1 for frequent testing purpose

    this.fieldWidth = 800;
    this.fieldHeight = 400;

    this.speedFactor = 1;
    this.paddlesSpeed = 20;

    this.paddlesHeight = (1 / 4) * this.fieldHeight;
    const paddlesWidth = (1 / 160) * this.fieldWidth;
    const paddlesDistance = (1 / 20) * this.fieldWidth;
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
    this.ballAcceleration = 0.5;
    this.ballX = this.fieldWidth / 2;
    this.ballY = this.fieldHeight / 2;
    this.ballSpeedX = this.speedFactor * Math.cos(startAngle);
    this.ballSpeedY = this.speedFactor * Math.sin(startAngle);
  }

  /* Generates a random starting startAngle which is not orthogonal to any boundary. */
  randomAngle() {
    const p = Math.PI;
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

  movePaddleUp(player: User) {
    if (player == this.user1) {
      if (this.leftPosition > this.paddlesSpeed ) {
        this.leftPosition -= this.paddlesSpeed;
      }
      else if (this.leftPosition <= this.paddlesSpeed && this.leftPosition > 0) {
        this.leftPosition = 0;
      }
    }
    else if (player == this.user2) {
      if (this.rightPosition > this.paddlesSpeed) {
        this.rightPosition -= this.paddlesSpeed;
      }
      else if (this.rightPosition <= this.paddlesSpeed && this.rightPosition > 0) {
        this.rightPosition = 0;
      }

    }
  }
  movePaddleDown(player: User) {
    if (player == this.user1) {
      if (this.leftPosition + this.paddlesHeight + this.paddlesSpeed < this.fieldHeight) {
        this.leftPosition += this.paddlesSpeed;
      }
      else if (this.leftPosition + this.paddlesHeight < this.fieldHeight) {
        this.leftPosition = this.fieldHeight - this.paddlesHeight;
      }
    }
    else if (player == this.user2) {
      if (this.rightPosition + this.paddlesHeight + this.paddlesSpeed < this.fieldHeight) {
        this.rightPosition += this.paddlesSpeed;
      }
      else if (this.rightPosition + this.paddlesHeight < this.fieldHeight) {
        this.rightPosition = this.fieldHeight - this.paddlesHeight;
      }
    }
  }

  leftBreakthrough() {
    if (this.ballX <= this.ballRadius) {
      this.scorePlayer2 += 1;
      sharedEventEmitter.emit('scoreUpdate', this);
      this.gameInit();
    }
  }

  rightBreakthrough() {
    if (this.ballX >= this.fieldWidth - this.ballRadius) {
      this.scorePlayer1 += 1;
      sharedEventEmitter.emit('scoreUpdate', this);
      this.gameInit();
    }
  }

  collisionLeft() {
    const collisionAreaX0 = this.leftBorder;
    const collisionAreaX1 = this.leftBorder + 2 * this.ballRadius;
    const collisionAreaY0 = Math.min(
      this.leftPosition,
      this.leftPosition - 2 * this.ballRadius,
    );
    const collisionAreaY1 = Math.min(
      this.leftPosition + this.paddlesHeight,
      this.fieldHeight,
    );
    if (
      this.ballX > collisionAreaX0 &&
      this.ballX < collisionAreaX1 &&
      this.ballY > collisionAreaY0 &&
      this.ballY < collisionAreaY1
    ) {
      const distance = Math.max(this.ballY - this.leftPosition, 0);
      const angle = this.impact(distance);
      this.ballSpeedX = this.speedFactor * Math.cos(angle) * (1 + this.ballAcceleration) * (1 + this.ballAcceleration);
      this.ballSpeedY = this.speedFactor * Math.sin(angle) * (1 + this.ballAcceleration);
        this.ballAcceleration += this.ballAcceleration * (1 + this.ballAcceleration);
        this.ballAcceleration += this.ballAcceleration;
    }
  }

  collisionRight() {
    const collisionAreaX0 = this.rightBorder - 2 * this.ballRadius;
    const collisionAreaX1 = this.rightBorder;
    const collisionAreaY0 = Math.min(
      this.rightPosition,
      this.rightPosition - 2 * this.ballRadius,
    );
    const collisionAreaY1 = Math.min(
      this.rightPosition + this.paddlesHeight,
      this.fieldHeight,
    );
    if (
      this.ballX > collisionAreaX0 &&
      this.ballX < collisionAreaX1 &&
      this.ballY > collisionAreaY0 &&
      this.ballY < collisionAreaY1
    ) {
      const distance = Math.max(this.ballY - this.rightPosition, 0);
      const angle = this.impact(distance);
      this.ballSpeedX = - this.speedFactor * Math.cos(angle) * (1 + this.ballAcceleration);
      this.ballSpeedY = this.speedFactor * Math.sin(angle) * (1 + this.ballAcceleration);
      this.ballAcceleration *= this.ballAcceleration;
    }
  }

  collisionTop() {
    if (this.ballY <= this.ballRadius) {
      return true;
    }
    return false;
  }

  collisionBottom() {
    if (this.ballY >= this.fieldHeight - this.ballRadius) {
      return true;
    }
    return false;
  }

  collisionField() {
    if (this.collisionTop() || this.collisionBottom()) {
      this.ballSpeedY = -this.ballSpeedY;
    }
  }

  impact(distance: number) {
    const p = Math.PI;
    const angle = (p / (2 * this.paddlesHeight)) * distance - p / 4;
    return angle;
  }

  async playerVictory() {
    if (
      this.scorePlayer1 == this.winningScore ||
      this.scorePlayer2 == this.winningScore
    ) {
      await this.updateGameScore();
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.gameInit();
      /* promote flag to second round if this has been a 1st round tournament game */
      if (this.tournamentStatus && this.tournamentStatus & 2) {
        this.tournamentStatus = this.tournamentStatus << 1;
      }
      if (this.scorePlayer1 == this.winningScore) {
        this.winningPlayer = this.user1;
      } else {
        this.winningPlayer = this.user2;
      }
      sharedEventEmitter.emit('victory', this);
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

    async initializeGame(leftId: number, rightId: number) {
      // Assuming you're using Prisma to interact with a database
      this.GameData = await this.prisma.games.create({
        data: {
          left_user_id: leftId,
          right_user_id: rightId,
          left_user_score: 0,
          right_user_score: 0,
          createdAt: new Date(),
        },
      });

    // You can handle the result or perform other actions based on the Prisma query result
    console.log('GAME.STATE: INITIALIZEGAME, New game created:', this.GameData);
    if (this.tournamentStatus & 2) {
      console.log('GAME.STATE: INITIALIZEGAME, Tournament first round');
    }
    if (this.tournamentStatus & 4) {
      console.log('GAME.STATE: INITIALIZEGAME, Tournament second round');
    }
  }

  async updateGameScore() {
    try {
      const updatedGame = await this.prisma.games.update({
        where: { id: this.GameData.id }, // Specify the condition for the row to be updated (in this case, based on the game's ID)
        data: {
          left_user_score: this.scorePlayer1,
          right_user_score: this.scorePlayer2,
          // Other fields you want to update
        },
      });
      console.log('GAME.STATE: UPDATEGAMESCORE, Updated game:', updatedGame);
    } catch (error) {
      console.error('GAME.STATE: UPDATEGAMESCORE, Error updating game:', error);
    }
  }
  countDown(): Promise<void> {
    return new Promise((resolve) => {
      this.currentCount = 3;
      this.intervalCountId = setInterval(
        ()=>{
          sharedEventEmitter.emit('countDown', this);
          if (this.currentCount > 0) {
            this.currentCount--;
          } else {
            clearInterval(this.intervalCountId);
            this.intervalCountId = null;
            resolve();
          }
        }, 1000);
      });
    };
}
