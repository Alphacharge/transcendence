// game.service.ts
import { Injectable } from "@nestjs/common";
import { EventEmitter } from "stream";

@Injectable()
export class GameService {
	private	gameUpdateEventEmitter = new EventEmitter();

	onGameStart(callback: () => void) {
		this.gameUpdateEventEmitter.on("startGame", callback);
	}

}
