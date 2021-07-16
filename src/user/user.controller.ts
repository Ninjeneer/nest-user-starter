import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { TokenGuard } from '../token.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(TokenGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@UseGuards()
	async create(@Req() request: Request, @Body() createUserDto: Prisma.UserCreateInput) {
		const user = await this.userService.create({ ip: request.ip, ...createUserDto });
		delete user.password;
		return user;
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
		return this.userService.update({ id }, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}
