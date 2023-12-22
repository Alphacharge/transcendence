import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { AuthModule } from 'src/auth/auth.module';
import { GameController } from './game.controller';

@Module({
  imports: [AuthModule],
  providers: [GameGateway, GameService],
  controllers: [GameController],
})
export class GameModule {}
