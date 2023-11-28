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

      const isValid = await this.authService.validateToken(token);

      if (isValid) {
        res.status(200).json({ message: 'Authorized' });
      } else {
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('/42/callback')
  async handleCallback(@Req() request: Request) {
    const authorizationCode = request.query.code as string;
    const clientId=`${process.env.FORTYTWO_APP_ID}`;
    const clientSecret = `${process.env.FORTYTWO_APP_SECRET}`;
    const redirectUri = `${process.env.REDIRECT_URI}`;
    const tokenEndpoint = `${process.env.TOKEN_ENDPOINT}`;

    try {
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          redirect_uri: redirectUri,
        }),
      });
      let accessToken;
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        accessToken = tokenData.access_token;
      } else {
        console.error("AUTH.CONTROLLER: HANDLECALLBACK, Problems with the tokenresponse");
      }
      const apiResponse = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        console.log(`AUTH.CONTROLLER: HANDLECALLBACK, intra login: ${responseData.login}, email: ${responseData.email}`);
      } else {
        console.error('AUTH.CONTROLLER: HANDLECALLBACK, API Request failed', apiResponse.statusText);
      }
    } catch (error) {
      // Handle fetch errors
      console.error(`AUTH.CONTROLLER: HANDLECALLBACK, exception caught: ${error}`);
    }
  }
}
