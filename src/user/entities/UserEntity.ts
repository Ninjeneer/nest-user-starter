import { Exclude } from 'class-transformer';
import { UserRole } from '../user.service';

export default class UserEntity {
	id: string;
	email: string;
	ip: string;
	createdAt: Date;
	updatedAt: Date;
	role: UserRole | string;

	@Exclude()
	password: string;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
