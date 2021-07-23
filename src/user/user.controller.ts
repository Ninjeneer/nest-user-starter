import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { TokenGuard } from '../guards/token.guard';
import { UserRole, UserService } from './user.service';
import { SelfGuard } from '../guards/self.guard';
import CreateUserDTO from './dto/CreateUserDTO';
import UpdateUserDTO from './dto/UpdateUserDTO';
import UserEntity from './entities/UserEntity';

@Controller('users')
@UseGuards(TokenGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@Roles(UserRole.ADMIN)
	async create(@Req() request: Request, @Body() createUserDto: CreateUserDTO) {
		const user = await this.userService.create({ ip: request.ip, ...createUserDto });
		delete user.password;
		return new UserEntity({ ...user });
	}

	@Get()
	@Roles(UserRole.ADMIN)
	async findAll() {
		return (await this.userService.findAll()).map((user) => new UserEntity({ ...user }));
	}

	@Get(':id')
	async findOne(@Req() request, @Param('id') id: string) {
		const user = await this.userService.findOne({ id });
		if (!user) {
			throw new NotFoundException();
		}
		return new UserEntity({ ...user });
	}

	@Patch(':id')
	@UseGuards(SelfGuard)
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
		const user = await this.userService.update({ id }, updateUserDto);
		return new UserEntity({ ...user });
	}

	@Delete(':id')
	@UseGuards(SelfGuard)
	async remove(@Param('id') id: string) {
		const user = await this.userService.remove(id);
		return new UserEntity({ ...user });
	}

	/**
	 * Remove users password from requests
	 * Temporary fix until Prisma implement 'exclude' operator
	 * @param users user list
	 * @returns user without password list
	 */
	private hidePasswords(users: User[]): User[] {
		return users.map((u) => u);
	}

	private hidePassword(user: User): User {
		delete user.password;
		return user;
	}
}
