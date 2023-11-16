import { Socket } from "socket.io";
import { Users } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export class User {
  id: number;
  socket: Socket | null;
  inGame: boolean;
  userData: Users;

  constructor() {
    this.id = uuidv4();
    this.inGame = false;
  }
}
