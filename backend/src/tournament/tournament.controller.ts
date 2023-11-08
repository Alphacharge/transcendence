import { Controller, Post, Get, Delete, Body, Param, } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('tournament')
export class TournamentController {

	constructor(private tournamentService: TournamentService) {};

	@Post()
	async addToTrQueue(@Body() createPlayerDto: CreatePlayerDto) {
		return this.tournamentService.addToTrQueue(createPlayerDto);
	}

	@Get('count')
	async countAll() {
		const queueSize = this.tournamentService.getQueueSize()
		return `${queueSize} players in queue`;
	}

	@Get('all')
	async findall() {
		return this.tournamentService.findAll();
	}

	@Delete(':uniqueId')
	async removeFromTrQueue(@Param('uniqueId') playerUniqueId: string) {
	  const result = this.tournamentService.removePlayerByUniqueId(playerUniqueId);
	  if (result) {
		return `Player with unique ID ${playerUniqueId} removed from the tournament queue`;
	  } else {
		return `Player with unique ID ${playerUniqueId} not found in the queue`;
	  }
	}

	@Delete('destroy')
	async destroyQueue() {}
}
