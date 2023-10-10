import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Socket } from 'socket.io';
import { GameState } from 'src/game/GameState';

export class UserDto {
  constructor() {
    this.id = 0;
    this.inGame = false;
    this.socket = null;
    this.gamesPlayed = [];
  }

  @IsNumber()
  id: number;

  @IsBoolean()
  inGame: boolean;

  socket: Socket | null;

  // PLACEHOLDER for database
  gamesPlayed: string[];
}
