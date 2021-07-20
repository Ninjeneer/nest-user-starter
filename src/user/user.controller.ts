import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { EmailAlreadyUsedException } from '../exceptions/exceptions';
import { TokenGuard } from '../guards/token.guard';
import { UserRole, UserService } from './user.service';

@Controller('users')
@UseGuards(TokenGuard, RoleGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(@Req() request: Request, @Body() createUserDto: Prisma.UserCreateInput) {
		const user = await this.userService.create({ ip: request.ip, ...createUserDto });
		delete user.password;
		return user;
	}

	@Get()
	@Roles(UserRole.ADMIN)
	findAll(@Req() request) {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne({ id });
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
		const user = await this.userService.findOne({ id });
		if (!user) {
			throw new NotFoundException();
		}
		// Avoid taking someone else email
		if (updateUserDto.email && user.email !== updateUserDto.email) {
			const otherUser = await this.userService.findOne({ email: updateUserDto.email.toString() });
			if (otherUser) {
				throw new EmailAlreadyUsedException();
			}
		}
		return this.userService.update({ id }, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}
