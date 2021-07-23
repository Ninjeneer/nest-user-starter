import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.service';

export default class CreateUserDTO {
	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty({ enum: UserRole })
	role: UserRole;
}
