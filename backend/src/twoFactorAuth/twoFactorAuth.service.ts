import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async generate2FASecret(userId: number) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      String(userId),
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.prismaService.set2FASecretById(userId, secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  async is2FACodeValid(code: string, userId: number): Promise<boolean> {
    const secret = await this.prismaService.get2FASecretById(userId);

    return authenticator.verify({
      token: code,
      secret: secret,
    });
  }
}
