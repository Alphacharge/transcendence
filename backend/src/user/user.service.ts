import { Injectable } from '@nestjs/common';
import { UserDto } from './dto';

@Injectable()
export class UserService {
	createUserById(userId: number): UserDto {
		const userDto = new UserDto(userId);
		return userDto;
	}
}
