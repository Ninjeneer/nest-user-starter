import { EmailAlreadyUsedException, UserDoesNotExistException } from '../exceptions/exceptions';

import CreateUserDTO from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';
import UpdateUserDTO from './dto/update-user.dto';
import User from './entities/user.entity';

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
		user = await this.prisma.user.create({
			data: {
				email: createUserDto.email.toLowerCase(),
				password: encryptedPassword,
				role: createUserDto.role
			}
		});
		return User.from(user);
	}

	async findAll(): Promise<User[]> {
		return (await this.prisma.user.findMany()).map((u) => User.from(u));
	}

	async findOne(id: string): Promise<User> {
		return User.from(await this.prisma.user.findUnique({ where: { id } }));
	}

	async findOneByEmail(email: string, isAuth = false): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
		return User.from(user, { withPassword: isAuth });
	}

	async findOneByToken(token: string): Promise<User> {
		return User.from(await this.prisma.user.findFirst({ where: { token } }));
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
		return User.from(await this.prisma.user.update({ where: { id }, data: updateData }));
	}

	async addToken(id: string, token: string): Promise<User> {
		const user = await this.findOne(id);
		// Check user existence
		if (!user) {
			throw new UserDoesNotExistException();
		}
		return User.from(await this.prisma.user.update({ where: { id }, data: { token } }));
	}

	async remove(id: string): Promise<User> {
		const user = await this.findOne(id);
		if (!user) {
			throw new UserDoesNotExistException();
		}
		return User.from(await this.prisma.user.delete({ where: { id } }));
	}
}
