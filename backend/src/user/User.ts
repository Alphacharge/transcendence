import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  socket: Socket | null;
  username: string;
  password: string;

  inGame: boolean;

  constructor() {
    this.id = uuidv4();

    this.inGame = false;
  }
}
