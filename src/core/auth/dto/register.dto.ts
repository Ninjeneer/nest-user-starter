import { IsEmail, IsNotEmpty, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import config from '../../../assets/config.json';

export default class RegisterDTO {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@Length(config.security.password.length)
	password: string;
}
