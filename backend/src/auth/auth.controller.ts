import { Body, Controller, HttpCode, HttpStatus, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

	@Post('signup')
	signup(@Body() dto: AuthDto) {
	  console.log({
		  dto,
		});
		// return this.authService.signup(dto);
		return 'signup registered';
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	signin(@Body() dto: AuthDto) {
		console.log("registered login attempt");
		// return this.authService.signin(dto);
		return 'login registered';
  }

    // debugging request
	@Get('test')
	testConnection() {
		console.log("received test request");
	  return 'Backend is up and running';
	}
}
