import { Injectable } from '@nestjs/common';
import { PlayerDto } from './dto/player.dto';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TournamentService {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}
  players: Map<number, PlayerDto> = new Map();

  async add(player: PlayerDto) {
    const valid = await this.authService.validateToken(player.playerToken);
    if (!valid) return -1;
    if (this.players.size < 4 && !this.players.get(player.userId)) {
      try {
        player.userData = await this.prismaService.getUserById(player.userId);
        if (player.userData) {
          delete player.userData.hash;
          this.players.set(player.userId, player);
        } else {
          console.error(
            `TOURNAMENT.SERVICE: ADD, User with ID ${player.userId} not found.`,
          );
          return -1;
        }
      } catch (error) {
        console.error(
          'TOURNAMENT.SERVICE: ADD, Error fetching user data:',
          error,
        );
        return -1;
      }
    }
    return this.players.size;
  }

  countAll() {
    return this.players.size;
  }

  findAll(): PlayerDto[] {
    // Convert the values of the `players` map to an array of PlayerDto objects
    return Array.from(this.players.values()).map((player) => ({
      playerToken: player.playerToken,
      userId: player.userId,
      userData: player.userData,
    }));
  }

  remove(playerId: number) {
    this.players.delete(playerId);
    return this.players.size;
  }

  getStatus(player: PlayerDto) {
    const index = this.players.has(player.userId);
    if (index) {
      return true;
    }
    return false;
  }
}
