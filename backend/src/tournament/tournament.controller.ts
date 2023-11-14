import { Controller, Post, Get, Delete, Body, Param, } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { AuthDto } from '../auth/dto/auth.dto';

@Controller('tournament')
export class TournamentController {

	constructor(private tournamentService: TournamentService) {};

	@Post('add')
	async create(@Body() player: AuthDto) {
		this.tournamentService.create(player);
	}

	@Get('all')
	async findAll(): Promise<AuthDto[]> {
		return this.tournamentService.findAll();
	}

	@Delete(':userId')
	async remove(@Param('userId') playerId: number) {
		this.tournamentService.remove(playerId);
	}
}
