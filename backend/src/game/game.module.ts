// game.module.ts
import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";

@Module({
	imports: [],
	providers: [GameGateway],
	exports: [],
})
export class GameModule {}
