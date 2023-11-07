import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
	ConfigModule.forRoot({
		isGlobal: true,
  	}),
	GameModule,
	UserModule,
	AuthModule,
	PrismaModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
