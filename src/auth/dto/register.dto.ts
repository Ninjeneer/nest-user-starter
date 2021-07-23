import { ApiProperty } from '@nestjs/swagger';

export default class RegisterDTO {
	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;
}
