import { TournamentState } from './TournamentState';
import { User } from 'src/user/User';
import { sharedEventEmitter } from './game.events';
import { Games } from '@prisma/client';
import { GameDto } from './dto/game.dto';

export class GameState {
  gameData: Games | null;
  intervalId: NodeJS.Timeout | null;
  intervalCountId: NodeJS.Timeout | null;

  isLocalGame: boolean;
  tournamentState: TournamentState | null;

  user1: User;
  user2: User;
  scorePlayer1: number;
  scorePlayer2: number;
  contactsPlayer1: number;
  contactsPlayer2: number;
  deltaContactsPlayer1: number;
  deltaContactsPlayer2: number;
  longestBreak: number;
  winningPlayer: User;
  winningScore: number;

  fieldWidth: number;
  fieldHeight: number;

  ballRadius: number;
  ballX: number;
  ballY: number;
  ballXPrev: number;
  ballYPrev: number;
  ballSpeedX: number;
  ballSpeedY: number;
  ballAcceleration: number;

  paddlesHeight: number;
  paddlesSpeed: number;

  leftPosition: number;
  leftImpact: number;
  leftMovement: number; // 0 = no movement | 1 = up | 2 = down

  rightPosition: number;
  rightImpact: number;
  rightMovement: number;

  speedFactor: number;
  speedFactorMax: number;
  speedFactorStart: number;

  currentCount: number;

  constructor() {
    this.gameData = null;
    this.intervalId = null;
    this.isLocalGame = false;
    this.tournamentState = null;

    this.user1 = null;
    this.user2 = null;
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0;
    this.contactsPlayer1 = 0;
    this.contactsPlayer2 = 0;
    this.deltaContactsPlayer1 = 0;
    this.deltaContactsPlayer2 = 0;
    this.longestBreak = 0;
    this.winningScore = 11; // normal is 11, set to 1 for frequent testing purpose

    this.fieldWidth = 800;
    this.fieldHeight = 400;

    this.speedFactorStart = 4;
    this.speedFactor = this.speedFactorStart;
    this.speedFactorMax = 15;
    this.paddlesSpeed = 4;

    this.paddlesHeight = (1 / 4) * this.fieldHeight;
    const paddlesWidth = (1 / 160) * this.fieldWidth;
    this.repositionPaddles();
    this.ballRadius = paddlesWidth;

    this.leftImpact = 0;
    this.rightImpact = 0;

    this.gameInit();
  }

  repositionPaddles() {
    const paddlesStartPosition = (this.fieldHeight - this.paddlesHeight) / 2;
    this.leftPosition = paddlesStartPosition;
    this.rightPosition = paddlesStartPosition;
  }

  gameInit() {
    const startAngle = this.randomAngle();
    this.ballAcceleration = 1.3;
    this.ballX = this.fieldWidth / 2;
    this.ballY = this.fieldHeight / 2;
    this.speedFactor = this.speedFactorStart;
    this.ballSpeedX = this.speedFactor * Math.cos(startAngle);
    this.ballSpeedY = this.speedFactor * Math.sin(startAngle);
    const breaklength = this.deltaContactsPlayer1 + this.deltaContactsPlayer2;
    if (breaklength > this.longestBreak) {
      this.longestBreak = breaklength;
    }
    this.deltaContactsPlayer1 = 0;
    this.deltaContactsPlayer2 = 0;
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
    return { x: this.ballX - this.ballRadius, y: this.ballY - this.ballRadius };
  }

  getScore() {
    return { player1: this.scorePlayer1, player2: this.scorePlayer2 };
  }

  movePaddleUp(player: User) {
    if (player === this.user1) {
      if (this.leftPosition > this.paddlesSpeed) {
        this.leftPosition -= this.paddlesSpeed;
      } else if (
        this.leftPosition <= this.paddlesSpeed &&
        this.leftPosition > 0
      ) {
        this.leftPosition = 0;
      }
    } else if (player === this.user2) {
      if (this.rightPosition > this.paddlesSpeed) {
        this.rightPosition -= this.paddlesSpeed;
      } else if (
        this.rightPosition <= this.paddlesSpeed &&
        this.rightPosition > 0
      ) {
        this.rightPosition = 0;
      }
    }
  }

  movePaddleDown(player: User) {
    if (player == this.user1) {
      if (
        this.leftPosition + this.paddlesHeight + this.paddlesSpeed <
        this.fieldHeight
      ) {
        this.leftPosition += this.paddlesSpeed;
      } else if (this.leftPosition + this.paddlesHeight < this.fieldHeight) {
        this.leftPosition = this.fieldHeight - this.paddlesHeight;
      }
    } else if (player == this.user2) {
      if (
        this.rightPosition + this.paddlesHeight + this.paddlesSpeed <
        this.fieldHeight
      ) {
        this.rightPosition += this.paddlesSpeed;
      } else if (this.rightPosition + this.paddlesHeight < this.fieldHeight) {
        this.rightPosition = this.fieldHeight - this.paddlesHeight;
      }
    }
  }

  leftBreakthrough() {
    this.scorePlayer2 += 1;
    sharedEventEmitter.emit('scoreUpdate', this);
    this.gameInit();
  }

  rightBreakthrough() {
    this.scorePlayer1 += 1;
    sharedEventEmitter.emit('scoreUpdate', this);
    this.gameInit();
  }

  collisionLeft() {
    if (this.ballX < 0) {
      // retroactively check intersection
      const slope =
        (this.ballY - this.ballYPrev) / (this.ballX - this.ballXPrev);
      const intersectionY = this.ballYPrev + slope * -this.ballXPrev;

      // the intersection was inside the paddle height
      if (
        intersectionY >= this.leftPosition &&
        intersectionY <= this.leftPosition + this.paddlesHeight
      ) {
        // calculate new speed
        const distance = Math.max(this.ballY - intersectionY, 0);
        const angle = this.impact(distance);
        this.ballSpeedX = this.speedFactor * Math.cos(angle);
        this.ballSpeedY = this.speedFactor * Math.sin(angle);
        if (this.speedFactor < this.speedFactorMax) {
          this.speedFactor *= this.ballAcceleration;
        }

        this.contactsPlayer1++;
        this.deltaContactsPlayer1++;
      } else {
        // update score
        this.leftBreakthrough();
      }
      return true;
    }
    return false;
  }

  collisionRight() {
    if (this.ballX > this.fieldWidth) {
      const slope =
        (this.ballY - this.ballYPrev) / (this.ballX - this.ballXPrev);
      const intersectionY =
        this.ballYPrev + slope * (this.fieldWidth - this.ballXPrev);

      if (
        intersectionY >= this.rightPosition &&
        intersectionY <= this.rightPosition + this.paddlesHeight
      ) {
        const distance = Math.max(this.ballY - intersectionY, 0);
        const angle = this.impact(distance);
        this.ballSpeedX = -this.speedFactor * Math.cos(angle);
        this.ballSpeedY = this.speedFactor * Math.sin(angle);
        if (this.speedFactor < this.speedFactorMax) {
          this.speedFactor *= this.ballAcceleration;
        }

        this.contactsPlayer2++;
        this.deltaContactsPlayer2++;
      } else {
        this.rightBreakthrough();
      }
      return true;
    }
    return false;
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
    if (this.collisionTop()) {
      this.ballSpeedY = -this.ballSpeedY;
      this.ballY = this.ballRadius + 1; // setting ball down to avoid it clipping through the edge
      return true;
    } else if (this.collisionBottom()) {
      this.ballSpeedY = -this.ballSpeedY;
      this.ballY = this.fieldHeight - this.ballRadius - 1;
      return true;
    }
    return false;
  }

  impact(distance: number) {
    const p = Math.PI;
    const angle = (p / (2 * this.paddlesHeight)) * distance - p / 4;
    return angle;
  }

  hasEnded(): boolean {
    if (
      this.scorePlayer1 >= this.winningScore ||
      this.scorePlayer2 >= this.winningScore
    ) {
      return true;
    }

    if (this.intervalId == null) {
      return true;
    }
    return false;
  }

  playerVictory() {
    if (this.hasEnded() == false) {
      return;
    }
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.gameInit();

    if (this.scorePlayer1 == this.winningScore) {
      this.winningPlayer = this.user1;
    } else {
      this.winningPlayer = this.user2;
    }

    // update tournament information
    if (this.tournamentState) {
      this.tournamentState.gamesPlayed++;
      this.tournamentState.winners.push(this.winningPlayer);
    }
    sharedEventEmitter.emit('victory', this);
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  countDown(): Promise<void> {
    return new Promise((resolve) => {
      this.currentCount = 3;
      this.intervalCountId = setInterval(() => {
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
  }

  applyDto(dto: GameDto) {
    this.fieldWidth = dto.fieldWidth;
    this.fieldHeight = dto.fieldHeight;
    this.ballX = dto.ballX;
    this.ballY = dto.ballY;
    this.ballXPrev = dto.ballXPrev;
    this.ballYPrev = dto.ballYPrev;
    this.ballSpeedX = dto.ballSpeedX;
    this.ballSpeedY = dto.ballSpeedY;
    this.paddlesHeight = dto.paddlesHeight;
    this.leftPosition = dto.leftPaddle;
    this.rightPosition = dto.rightPaddle;
    this.scorePlayer1 = dto.scorePlayer1;
    this.scorePlayer2 = dto.scorePlayer2;
  }

  toDto(winner: string) {
    return {
      fieldWidth: this.fieldWidth,
      fieldHeight: this.fieldHeight,
      ballX: this.ballX,
      ballY: this.ballY,
      ballXPrev: this.ballXPrev,
      ballYPrev: this.ballYPrev,
      ballSpeedX: this.ballSpeedX,
      ballSpeedY: this.ballSpeedY,
      paddlesHeight: this.paddlesHeight,
      leftPaddle: this.leftPosition,
      rightPaddle: this.rightPosition,
      scorePlayer1: this.scorePlayer1,
      scorePlayer2: this.scorePlayer2,
      contactsPlayer2: this.scorePlayer2,
      winner: winner,
    };
  }
}
