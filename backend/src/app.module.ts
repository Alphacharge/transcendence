import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TournamentController } from './tournament/tournament.controller';
import { TournamentService } from './tournament/tournament.service';
import { TournamentModule } from './tournament/tournament.module';
import { PrismaController } from './prisma/prisma.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GameModule,
    UserModule,
    AuthModule,
    PrismaModule,
    TournamentModule,
  ],
  controllers: [AppController, TournamentController, PrismaController],
  providers: [AppService, TournamentService],
})
export class AppModule {}
