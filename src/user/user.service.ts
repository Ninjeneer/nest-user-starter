import { Prisma, User } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';
import { EmailAlreadyUsedException } from '../exceptions/exceptions';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private securityService: SecurityService) {}

	async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
		// Check for existing user
		let user = await this.prisma.user.findUnique({ where: { email: createUserDto.email }});
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

	async findOneByEmail(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return await this.prisma.user.findUnique({ where });
	}

	async findOneByToken(where: Prisma.UserWhereInput): Promise<User> {
		return await this.prisma.user.findFirst({ where });
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
