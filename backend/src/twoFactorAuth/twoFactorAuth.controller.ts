import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  Body,
  Get,
  Request,
  Req
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { TwoFactorAuthService } from './twoFactorAuth.service';
import { HttpCode } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /* Endpoint for generating a new user secret. */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateSecret(@Req() req: Request): Promise<{ otpauthUrl }> {
    const { otpauthUrl } = await this.twoFactorAuthService.generate2FASecret(
      req['user'],
    );

    return { otpauthUrl };
  }

  @Post('enable')
  @UseGuards(JwtAuthGuard)
  async enable(@Req() req: Request) {
    this.prismaService.enable2FAById(req['user']);
    return { success: true, message: '2FA enabled.' };
  }

  /* Endpoint for disabling 2FA. */
  @Post('disable')
  @UseGuards(JwtAuthGuard)
  async disable(@Req() req: Request) {
    this.prismaService.disable2FAById(req['user']);

    return { success: true, message: '2FA disabled.' };
  }

  /* Endpoint for asking if 2FA is enabled for your account. */
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async check2FA(@Req() req: Request) {
    try {
      if (await this.prismaService.is2FAEnabledById(req['user'])) {
        console.log('2fa status: active');
        return { twoFactorEnabled: true, message: '2FA active' };
      } else {
        console.log('2fa status: inactive');
        return { twoFactorEnabled: false, message: '2FA not active' };
      }
    } catch (error) {
      return { twoFactorEnabled: false, message: 'Error checking 2FA' };
    }
  }

  /* Endpoint for authenticating via 2FA. */
  @Post('authenticate')
  @HttpCode(200)
  async authenticate(
    @Req() req: Request,
    @Body() body: { userId: number; code: string },
  ) {
    console.log('2fa authentication request received for user', body.userId);
    const isCodeValid = await this.twoFactorAuthService.is2FACodeValid(
      body.code,
      body.userId,
    );

    if (!isCodeValid) {
      console.log('2fa code invalid.');
      throw new UnauthorizedException('Invalid 2FA code');
    }

    console.log('2fa code accepted.');

    const databaseUser = await this.prismaService.getUser2FAById(body.userId);
    const accessToken = await this.authService.signToken(
      databaseUser.id,
      databaseUser.username,
    );

    console.log('2fa code valid');
    return {
      access_token: accessToken,
      userId: databaseUser.id,
      userName: databaseUser.username,
      requires2FA: databaseUser.two_factor_enabled,
    };
  }
}
