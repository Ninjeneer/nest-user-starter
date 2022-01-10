import { IsEmail, IsIP, IsOptional, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import config from '../../../assets/config.json';
import { UserRole } from '../entities/user.entity';

export default class CreateUserDTO {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsOptional()
	@Length(config.security.password.length)
	password: string;

	@ApiProperty({ enum: UserRole })
	role?: UserRole;

	@IsIP()
	@IsOptional()
	ip?: string;
}
