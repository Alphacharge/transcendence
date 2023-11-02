import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

//   @Get()
//   getAllUsers() {
//     return this.userService.getAllUsers();
//   }
}
