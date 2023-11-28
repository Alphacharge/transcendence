import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaController } from './prisma.controller';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  controllers: [PrismaController],
  providers: [PrismaService, AuthModule],
  exports: [PrismaService, AuthModule],
})
export class PrismaModule {}
