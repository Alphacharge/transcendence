// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LoginDTO } from './login.dto';
import { UserService } from 'src/user/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    console.log("Login requested by", loginDTO.username);

    const accessToken = 'your_access_token_here';

    // Return a response
    return { accessToken };
  }

  @Post('register')
  async register(@Body() loginDTO: LoginDTO) {
    console.log("Registration requested by", loginDTO.username);
    const newUser = await this.userService.createUser(loginDTO);
    return newUser;
  }
}
