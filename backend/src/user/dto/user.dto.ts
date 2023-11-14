import { IsNumber } from 'class-validator';


export class UserDto {
  constructor() {
    this.id = 0;
  }

  @IsNumber()
  id: number;
}
