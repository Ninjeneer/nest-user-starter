import { ApiProperty } from '@nestjs/swagger';

export default class LoginDTO {
	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;
}
