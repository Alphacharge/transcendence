import { Injectable } from '@nestjs/common';
import {PlayerDto} from './dto/player.dto';

@Injectable()
export class TournamentService {

	private tokens: string[] = [];

	add(playerToken: PlayerDto) {
		console.log('ADDING');
		if (this.tokens.length < 4 && !this.tokens.includes(playerToken.playerToken))
			this.tokens.push(playerToken.playerToken);
		console.log(this.tokens);
		return this.tokens.length;
	}

	findAll() {
		return this.tokens.length;
	}

	remove(playerToken: string) {
		console.log('REMOVING');
		const index = this.tokens.findIndex(token=>{
			return token==playerToken});
		console.log("Token :", playerToken,"\nIndex of this token is:", index);
		if (index !== -1) {
			this.tokens.splice(index,1)
			console.log("Token has been removed.");
		}
		console.log(this.tokens);
		return this.tokens.length;
	}
}
