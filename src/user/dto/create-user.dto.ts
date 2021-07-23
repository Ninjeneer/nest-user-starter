import { IsEmail, IsOptional, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.service';
import config from '../../assets/config.json';

export default class CreateUserDTO {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsOptional()
	@Length(config.security.password.length)
	password: string;

	@ApiProperty({ enum: UserRole })
	role: UserRole;
}
