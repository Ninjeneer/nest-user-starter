import { EmailAlreadyUsedException, UserDoesNotExistException } from '../exceptions/exceptions';

import CreateUserDTO from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SecurityService } from '../security/security.service';
import UpdateUserDTO from './dto/update-user.dto';
import User from './entities/user.entity';
import UserRepository from './user.repository';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private securityService: SecurityService,
		private userRepository: UserRepository
	) {}

	async create(createUserDto: CreateUserDTO): Promise<User> {
		// Check for existing user
		const user = await this.findOneByEmail(createUserDto.email);
		if (user) {
			throw new EmailAlreadyUsedException();
		}
		// Hash password
		const encryptedPassword = this.securityService.hashPassword(createUserDto.password);
		// Create user
		return await this.userRepository.create({ ...createUserDto, password: encryptedPassword });
	}

	async findAll(): Promise<User[]> {
		return await this.userRepository.findAll();
	}

	async findOne(id: string): Promise<User> {
		return await this.userRepository.findOne(id);
	}

	async findOneByEmail(email: string, isAuth = false): Promise<User> {
		return await this.userRepository.findByEmail(email, isAuth);
	}

	async findOneByToken(token: string): Promise<User> {
		return this.userRepository.findOneByToken(token);
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
		return await this.userRepository.update(id, updateData);
	}

	async addToken(id: string, token: string): Promise<User> {
		const user = await this.findOne(id);
		// Check user existence
		if (!user) {
			throw new UserDoesNotExistException();
		}
		return User.from(await this.prisma.user.update({ where: { id }, data: { token } }));
	}

	async remove(id: string): Promise<void> {
		const user = await this.findOne(id);
		if (!user) {
			throw new UserDoesNotExistException();
		}
		await this.userRepository.remove(id);
	}
}
