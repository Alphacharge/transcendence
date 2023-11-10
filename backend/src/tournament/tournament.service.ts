import { Injectable } from '@nestjs/common';
import { Player } from './interfaces/tournament.interface';

@Injectable()
export class TournamentService {

	private players: Player[] = [];

	create(player: Player) {
		const uniqueIds = this.players.map(innerObject => innerObject.playerUniqueId);
		if (this.players.length < 4 && !uniqueIds.includes(player.playerUniqueId))
			this.players.push(player);
		console.log(this.players);
	}

	findAll() {
		return this.players;
	}

	remove(playerUniqueId: string) {
		this.players = this.players.filter(innerObject=>innerObject.playerUniqueId !== playerUniqueId);
		console.log(this.players);
	}
}
