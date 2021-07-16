import { Prisma, User } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '..//security/security.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private securityService: SecurityService) {}

	async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
		createUserDto.password = this.securityService.hashPassword(createUserDto.password);
		const user = await this.prisma.user.create({ data: createUserDto });
		return user;
	}

	async findAll(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async findOne(id: string): Promise<User> {
		return await this.prisma.user.findUnique({ where: { id } });
	}

	async findOneByEmail(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return await this.prisma.user.findUnique({ where });
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
