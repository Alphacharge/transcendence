import { Injectable } from '@nestjs/common';
import {PlayerDto} from './dto/player.dto';

@Injectable()
export class TournamentService {

	private tokens: string[] = [];

	add(player: PlayerDto) {
		if (this.tokens.length < 4 && !this.tokens.includes(player.playerToken))
			this.tokens.push(player.playerToken);
		console.log(`add called\n${this.tokens}\n${this.tokens.length}`);
		return this.tokens.length;
	}

	countAll() {
		console.log(`countAll called\n${this.tokens}\n${this.tokens.length}`);
		return this.tokens.length;
	}

	remove(playerToken: string) {
		const index = this.tokens.findIndex(token=>{
			return token==playerToken});
			if (index !== -1) {
				this.tokens.splice(index,1)
			}
		console.log(`remove called\n${this.tokens}\n${this.tokens.length}`);
		return this.tokens.length;
	}

	getStatus(player: PlayerDto) {
		const index = this.tokens.findIndex(token=>{
			return token==player.playerToken});
			if (index !== -1) {
				return true;
			}
		console.log(`getStatus called\n${this.tokens}\n${this.tokens.length}`);
		return false;
	}
}
