import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.service';

export default class CreateUserDTO {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	password: string;

	@ApiProperty({ enum: UserRole })
	role: UserRole;
}
