// game.module.ts
import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameState } from './GameState';

@Module({
  imports: [],
  providers: [GameGateway, GameService, GameState],
  exports: [],
})
export class GameModule {}
