import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {

	constructor(private userService: UserService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Req() request: Request) {
		return request.user;
	}

	@Post('register')
	async register(@Req() request: Request) {
		return this.userService.create(request.body);
	}
}
