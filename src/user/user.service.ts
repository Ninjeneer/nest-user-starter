import { EmailAlreadyUsedException, UserDoesNotExistException } from '../exceptions/exceptions';
import { Prisma, User } from '@prisma/client';

import CreateUserDTO from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';
import UpdateUserDTO from './dto/update-user.dto';

export enum UserRole {
	BASIC = 'basic',
	ADMIN = 'admin'
}

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private securityService: SecurityService) {}

	async create(createUserDto: CreateUserDTO): Promise<User> {
		// Check for existing user
		let user = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
		if (user) {
			throw new EmailAlreadyUsedException();
		}
		// Hash password
		const encryptedPassword = this.securityService.hashPassword(createUserDto.password);
		// Create user
		user = await this.prisma.user.create({ data: { ...createUserDto, password: encryptedPassword } });
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

	async findOneByToken(token: string): Promise<User> {
		return await this.prisma.user.findFirst({ where: { tokens: { some: { value: token } } } });
	}

	async update(id: string, data: UpdateUserDTO): Promise<User> {
		const user = await this.prisma.user.findFirst({ where: { id } });
		const updateData = { ...data };
		// Check user existence
		if (!user) {
			throw new UserDoesNotExistException();
		}
		// Avoid taking someone else email
		if (data.email && user.email !== data.email) {
			const otherUser = await this.findOneByEmail(data.email.toString());
			if (otherUser) {
				throw new EmailAlreadyUsedException();
			}
		}
		// If the password is changed, hash it
		if (data.password) {
			updateData.password = this.securityService.hashPassword(data.password.toString());
		}
		// Update the user
		return await this.prisma.user.update({ where: { id }, data: updateData });
	}

	async addToken(id: string, token: Prisma.TokenCreateWithoutUserInput) {
		let user = await this.prisma.user.findFirst({ where: { id } });
		// Check user existence
		if (!user) {
			throw new UserDoesNotExistException();
		}
		user = await this.prisma.user.update({ where: { id }, data: { tokens: { create: [token] } } });
		return user;
	}

	async remove(id: string): Promise<User> {
		const user = await this.findOne(id);
		if (!user) {
			throw new UserDoesNotExistException();
		}
		return await this.prisma.user.delete({ where: { id } });
	}
}
