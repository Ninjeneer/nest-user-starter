import { Prisma, User } from '@prisma/client';

import { EmailAlreadyUsedException } from '../exceptions/exceptions';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';

export enum UserRole {
	BASIC = 'basic',
	ADMIN = 'admin'
}

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private securityService: SecurityService) {}

	async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
		// Check for existing user
		let user = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
		if (user) {
			throw new EmailAlreadyUsedException();
		}
		// Hash password
		createUserDto.password = this.securityService.hashPassword(createUserDto.password);
		// Create user
		user = await this.prisma.user.create({ data: createUserDto });
		return user;
	}

	async findAll(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return await this.prisma.user.findUnique({ where });
	}

	async findOneByEmail(email: string): Promise<User> {
		return await this.prisma.user.findUnique({ where: { email } });
	}

	async findOneByToken(token: string): Promise<User> {
		return await this.prisma.user.findFirst({ where: { tokens: { some: { value: token } } } });
	}

	async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User> {
		// If the password is changed, hash it
		if (data.password) {
			data.password = this.securityService.hashPassword(data.password.toString());
		}
		// Update the user
		return await this.prisma.user.update({ where, data });
	}

	async remove(id: string): Promise<User> {
		return await this.prisma.user.delete({ where: { id } });
	}
}
