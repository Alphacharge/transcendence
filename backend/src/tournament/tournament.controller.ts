import { Controller, Post, Get, Delete, Body, Param, } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Player } from './interfaces/tournament.interface'

@Controller('tournament')
export class TournamentController {

	constructor(private tournamentService: TournamentService) {};

	@Post('add')
	async create(@Body() createTournamentDto: CreateTournamentDto) {
		this.tournamentService.create(createTournamentDto);
	}

	@Get('all')
	async findAll(): Promise<Player[]> {
		return this.tournamentService.findAll();
	}

	@Delete(':playerUniqueId')
	async remove(@Param('playerUniqueId') playerUniqueId: string) {
		this.tournamentService.remove(playerUniqueId);
	}
}
