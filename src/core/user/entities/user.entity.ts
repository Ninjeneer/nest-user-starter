import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User as PrismaUser } from '@prisma/client';

export enum UserRole {
	BASIC = 'basic',
	ADMIN = 'admin'
}

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
	role: UserRole;

	@Exclude()
	password: string;

	@ApiProperty()
	token?: string;

	constructor() {}

	public static from(prismaUser: PrismaUser, options?: { withPassword: boolean }) {
		if (!prismaUser) {
			return null;
		}
		const user = new User();
		Object.assign(user, { ...prismaUser });
		if (options) {
			if (!options.withPassword) {
				delete user.password;
			}
		} else {
			delete user.password;
		}
		return user;
	}
}
