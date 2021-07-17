import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenGuard } from '../token.guard';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {

	constructor(private userService: UserService, private tokenService: TokenService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Req() request: Request) {
		return request.user;
	}

	@Post('register')
	async register(@Req() request: Request) {
		return this.userService.create(request.body);
	}

	@Post('logout')
	@UseGuards(TokenGuard)
	async logout(@Req() request: Request) {
		const user = this.userService.findOneByToken({ tokens: { some: { value: request.token }}});
		this.tokenService.revoke({ value: request.token });
	}
}
