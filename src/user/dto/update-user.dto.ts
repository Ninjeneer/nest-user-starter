import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { UserRole } from '../user.service';

export default class UpdateUserDTO {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	role: UserRole;
}
