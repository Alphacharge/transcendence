import { IsNumber } from 'class-validator';

export class GameDto {
  @IsNumber()
  readonly fieldWidth: number;

  @IsNumber()
  readonly fieldHeight: number;

  @IsNumber()
  readonly ballX: number;

  @IsNumber()
  readonly ballY: number;

  @IsNumber()
  readonly ballXPrev: number;

  @IsNumber()
  readonly ballYPrev: number;

  @IsNumber()
  readonly ballSpeedX: number;

  @IsNumber()
  readonly ballSpeedY: number;

  @IsNumber()
  readonly paddlesHeight: number;

  @IsNumber()
  readonly leftPaddle: number;

  @IsNumber()
  readonly rightPaddle: number;

  @IsNumber()
  readonly scorePlayer1: number;

  @IsNumber()
  readonly scorePlayer2: number;

  readonly winner: string;
}
