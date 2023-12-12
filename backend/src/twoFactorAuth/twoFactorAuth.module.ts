import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy';
import { TwoFactorAuthService } from 'src/twoFactorAuth/twoFactorAuth.service';
import { TwoFactorAuthController } from './twoFactorAuth.controller';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [TwoFactorAuthController],
  providers: [JwtStrategy, JwtService, TwoFactorAuthService],
  exports: [JwtService, TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
