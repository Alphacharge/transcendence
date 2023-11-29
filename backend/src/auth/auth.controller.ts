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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Request, Response } from 'express';

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
      // ? checks if any of the called properties returned null and doesn't execute what follows after
      // header format: Authorization: Bearer <token>
      const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the authorization header

      if (!token) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }

      const { valid, renewedToken } =
        await this.authService.validateToken(token);

      if (valid) {
        if (renewedToken) {
          res.status(200).json({ message: 'Authorized', renewedToken });
        } else {
          res.status(200).json({ message: 'Authorized' });
        }
      } else {
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('/42/callback')
  async handleCallback(@Req() request: Request, @Res() response: Response) {
    const authResponse = await this.authService.handleCallback(request);
    const url = new URL(`${request.protocol}:${request.hostname}`);
    url.port = '8080';
    url.pathname = 'redirect';
    url.searchParams.set('access_token', authResponse.access_token);
    url.searchParams.set('userId', authResponse.userId.toString());
    url.searchParams.set('userEmail', authResponse.userName);
    console.log(`AUTH.CONTROLLER, HANDLECALLBACK, url=${url}`);
    response.status(302).redirect(url.href);
  }
}
