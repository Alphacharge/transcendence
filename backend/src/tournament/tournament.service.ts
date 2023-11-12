import { Injectable } from '@nestjs/common';
import { User } from '../auth/interfaces/user.interface';

@Injectable()
export class TournamentService {

	private players: User[] = [];

	create(player: User) {
		const uniqueIds = this.players.map(innerObject => innerObject.id);
		if (this.players.length < 4 && !uniqueIds.includes(player.id))
			this.players.push(player);
		console.log(this.players);
	}

	findAll() {
		return this.players;
	}

	remove(userId: number) {
		this.players = this.players.filter(innerObject=>innerObject.id !== userId);
		console.log(this.players);
	}
}
