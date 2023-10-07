import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"
import { Socket } from "socket.io";

export class UserDto {
	// constructor(id: number) {
	// 	this.id = id;
	// 	this.inGame = false;
	// 	this.socket = null;
	// }

	@IsNumber()
	id: number;

	@IsBoolean()
	inGame: boolean;

	socket: Socket | null;
}