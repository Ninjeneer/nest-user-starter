import { ApiProperty } from '@nestjs/swagger';
import UserEntity from '../../user/entities/UserEntity';

export default class LoggedUserEntity extends UserEntity {
	@ApiProperty()
	token: string;
}
