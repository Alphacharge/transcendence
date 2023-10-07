import { IsNumber, IsOptional, IsString } from "class-validator"

export class UserDto {
	constructor(id: number) {
		this.id = id;
	}
	@IsNumber()
	id: number;

	@IsString()
	@IsOptional()
	side?: string;

	@IsString()
	@IsOptional()
	name?: string;
}