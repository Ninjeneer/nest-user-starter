import { Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { TokenGuard } from '../guards/token.guard';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private userService: UserService, private tokenService: TokenService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	@HttpCode(200)
	async login(@Req() request: Request, @Res() response: Response) {
		response.status(200).send(request.user);
	}

	@Post('register')
	async register(@Req() request: Request) {
		return this.userService.create(request.body);
	}

	@Post('logout')
	@UseGuards(TokenGuard)
	async logout(@Req() request: Request) {
		this.tokenService.revoke({ value: request.token });
	}
}
