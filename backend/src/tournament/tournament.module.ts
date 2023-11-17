import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TournamentController],
  providers: [TournamentService, AuthService, JwtService],
})
export class TournamentModule {}
