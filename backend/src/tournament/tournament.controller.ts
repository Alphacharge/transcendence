import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { PlayerDto } from './dto/player.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private tournamentService: TournamentService) {}

  @Post('add')
  async add(@Body() player: PlayerDto) {
    const response = this.tournamentService.add(player);
    return { response };
  }

  @Post('status')
  async getStatus(@Body() player: PlayerDto) {
    const response = this.tournamentService.getStatus(player);
    return { response };
  }

  @Get('count')
  async countAll() {
    const response = this.tournamentService.countAll();
    return { response };
  }

  @Get('all')
  async findAll() {
    const response = this.tournamentService.findAll();
    return { response };
  }

  @Delete(':token')
  async remove(@Param('token') playerId: number) {
    const response = this.tournamentService.remove(playerId);
    return { response };
  }
}
