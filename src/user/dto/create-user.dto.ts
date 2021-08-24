import { IsEmail, IsIP, IsOptional, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.service';
import config from '../../assets/config.json';

export default class CreateUserDTO {
	@ApiProperty()
	@IsEmail()
	readonly email: string;

	@ApiProperty()
	@IsOptional()
	@Length(config.security.password.length)
	readonly password: string;

	@ApiProperty({ enum: UserRole })
	readonly role?: UserRole;

	@IsIP()
	@IsOptional()
	readonly ip?: string;
}
