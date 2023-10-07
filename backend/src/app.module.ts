// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [GameModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
