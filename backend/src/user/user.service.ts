import { Injectable } from '@nestjs/common';
import { LoginDTO } from 'src/auth/login.dto';
import { User } from './User';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();
  // createUserById(userId: number): UserDto {
  // 	const userDto = new UserDto(userId);
  // 	return userDto;
  // }
  async createUser(registrationData: LoginDTO) {
    const newUser = new User();
    newUser.username = registrationData.username;
    newUser.password = registrationData.password;

    this.users.set(newUser.id, newUser);

    return(newUser);
  }

  getUserById(userId: string) {
    return this.users.get(userId);
  }
}
