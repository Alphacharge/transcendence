import { Injectable } from '@nestjs/common';
import { Player } from './interfaces/player.interface';

@Injectable()
export class TournamentService {
	private players: Player[] = [];

	addToTrQueue(player: Player) {
		const alreadyQueued = this.players.some(existingPlayer=> existingPlayer.playerUniqueId === player.playerUniqueId);
		if (!alreadyQueued) {
			console.log(player, alreadyQueued);
			this.players.push(player);
			return `Player ${player.playerName} added`;
		}
		return `Player ${player.playerName} already queued`;
	}

	getQueueSize(): number {
		return this.players.length;
	}

	findAll(): Player[] {
		return this.players;
	}

	removePlayerByUniqueId(playerUniqueId: string): boolean {
		const playerIndex = this.players.findIndex(player => player.playerUniqueId === playerUniqueId);
		if (playerIndex !== -1) {
		  this.players.splice(playerIndex, 1);
		  return true;
		} else {
		  return false;
		}
	  }

	destroyQueue() {
		this.players = [];
	}
}
