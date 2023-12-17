import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  Header,
  Res,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request as expressRequest } from 'express';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto, false);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  @Post('password-change')
  @UseGuards(JwtAuthGuard)
  pwChange(
    @Body() body: { oldPassword: string; newPassword: string },
    @Req() req: Request,
  ) {
    return this.authService.pwChange(
      req['user'],
      body.oldPassword,
      body.newPassword,
    );
  }

  // not using auth guard here because it would return 401 unauthorized :P
  @Get('check')
  @Header('Content-Type', 'application/json')
  async checkLoggedIn(@Req() req: Request) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        // If no token exists, send a response indicating user not logged in
        return { isLoggedIn: false, message: 'User not logged in' };
      }

      const validToken = await this.authService.validateToken(token);

      if (validToken) {
        return { isLoggedIn: true, message: 'Authorized' };
      } else {
        // If the token is invalid/expired, it's not an authentication error but an indication of not being logged in
        return { isLoggedIn: false, message: 'User not logged in' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Could not check login status');
    }
  }

  @Get('/42/callback')
  async handleCallback(
    @Req() request: expressRequest,
    @Res() response: Response,
  ) {
    const authResponse = await this.authService.handleCallback(request);
    if (authResponse) {
      const url = new URL(`${request.protocol}:${request.hostname}`);
      url.port = '8080';
      url.pathname = 'redirect';
      url.searchParams.set('access_token', authResponse.access_token);
      url.searchParams.set('userId', authResponse.userId.toString());
      url.searchParams.set('userName', authResponse.userName);
      response.status(302).redirect(url.href);
    } else {
      const errorCode = '1';
      const url = new URL(`${request.protocol}:${request.hostname}`);
      url.port = '8080';
      url.pathname = `error/${errorCode}`;
      response.status(409).redirect(url.href);
    }
  }
}
