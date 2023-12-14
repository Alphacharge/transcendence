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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@UseGuards(AuthDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get('check')
  @Header('Content-Type', 'application/json')
  async checkLoggedIn(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        // If no token exists, send a response indicating user not logged in
        res
          .status(200)
          .json({ isLoggedIn: false, message: 'User not logged in' });
        return;
      }

      const validToken = await this.authService.validateToken(token);

      if (validToken) {
        res.status(200).json({ isLoggedIn: true, message: 'Authorized' });
      } else {
        // If the token is invalid/expired, it's not an authentication error but an indication of not being logged in
        res
          .status(200)
          .json({ isLoggedIn: false, message: 'User not logged in' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('/42/callback')
  async handleCallback(@Req() request: Request, @Res() response: Response) {
    const authResponse = await this.authService.handleCallback(request);
    if (!authResponse) return;

    const url = new URL(`${request.protocol}:${request.hostname}`);
    url.port = '8080';
    url.pathname = 'redirect';
    url.searchParams.set('access_token', authResponse.access_token);
    url.searchParams.set('userId', authResponse.userId.toString());
    url.searchParams.set('userName', authResponse.userName);
    response.status(302).redirect(url.href);
  }
}
