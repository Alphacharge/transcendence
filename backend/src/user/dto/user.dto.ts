import { IsNumber } from 'class-validator';


export class UserDto {
  constructor() {
    this.id = 0;

    this.inGame = false;
    this.socket = null;
  }

  @IsNumber()
  id: number;

  @IsBoolean()
  inGame: boolean;

  socket: Socket | null;
}
