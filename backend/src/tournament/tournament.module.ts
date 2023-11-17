import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service'
import { TournamentController } from './tournament.controller'
import { AuthModule } from 'src/auth/auth.module';


@Module({
	imports: [AuthModule],
	controllers: [TournamentController],
	providers: [TournamentService],
})

export class TournamentModule {}
