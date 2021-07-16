import { Prisma, User } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '..//security/security.service';
import { UpdateUserDto } from './dto/update-user.dto';

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

	async findOneByEmail(email: string): Promise<User> {
		return await this.prisma.user.findUnique({ where: { email } });
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		// If the password is changed, hash it
		if (updateUserDto.password) {
			updateUserDto.password = this.securityService.hashPassword(updateUserDto.password);
		}
		// Update the user
		return await this.prisma.user.update({
			where: { id },
			data: updateUserDto
		});
	}

	async remove(id: string): Promise<User> {
		return await this.prisma.user.delete({ where: { id } });
	}
}
