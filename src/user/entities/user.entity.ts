import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from '../user.service';

export default class User {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	ip: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty({ enum: UserRole })
	role: UserRole | string;

	@Exclude()
	password: string;

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}
}
