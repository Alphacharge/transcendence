import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TournamentModule } from './tournament/tournament.module';
import { PrismaController } from './prisma/prisma.controller';
import { TwoFactorAuthModule } from './twoFactorAuth/twoFactorAuth.module';

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
    TwoFactorAuthModule,
  ],
  controllers: [AppController, PrismaController],
  providers: [AppService],
})
export class AppModule {}
