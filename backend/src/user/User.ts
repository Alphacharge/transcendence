import { Socket } from "socket.io";
import { Users } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export class User {
  socket: Socket | null;
  inGame: boolean;
  userData: Users | undefined;

  constructor() {
    this.inGame = false;
	this.socket = null;
	this.userData = undefined;
  }
}
