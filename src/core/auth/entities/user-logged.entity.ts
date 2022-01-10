import { ApiProperty } from '@nestjs/swagger';
import User from '../../user/entities/user.entity';

export default class LoggedUserEntity extends User {
	@ApiProperty()
	token: string;
}
