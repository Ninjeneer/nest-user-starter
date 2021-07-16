import { Prisma, User } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
		const user = await this.prisma.user.create({ data: createUserDto });
		return user;
	}

	async findAll() {
		return await this.prisma.user.findMany();
	}

	async findOne(id: string) {
		return await this.prisma.user.findUnique({ where: { id } });
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		return await this.prisma.user.update({
			where: { id },
			data: updateUserDto
		});
	}

	async remove(id: string) {
		return await this.prisma.user.delete({ where: { id } });
	}
}
