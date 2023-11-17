import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

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
  async checkLoggedIn(@Req() req: Request) {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the authorization header
      if (!token) {
        return { message: 'Unauthorized' }; // Handle cases where the token is missing
      }

      const userData = await this.authService.validateToken(token); // Use your authService to validate the token

      if (userData) {
        return userData; // Return user data or an indication of successful login
      } else {
        return { message: 'Unauthorized' }; // Handle cases where the token is invalid/expired
      }
    } catch (error) {
      return { message: 'Error checking login status' }; // Handle other potential errors
    }
  }
}
