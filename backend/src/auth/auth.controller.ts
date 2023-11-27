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
    /* TODO use environment variables in following instead of actual values */
    const clientId = 'u-s4t2ud-00df0bcc6de43b6037219a0bdd40cc161fa358149677d5c0036fbe5174a2190b';
    const clientSecret = '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';
    const redirectUri = 'https://127.0.0.1:3000/auth/42/callback';
    const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';

    try {
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: authorizationCode,
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          redirect_uri: redirectUri,
        }),
      });
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        console.log(`DEBUG accessToken=${accessToken}`)
      } else {
        console.error("DEBUG Problems with the tokenresponse");
      }
    } catch (error) {
      // Handle fetch errors
      console.error("Problems with the tokenresponse");
    }
  }
}
