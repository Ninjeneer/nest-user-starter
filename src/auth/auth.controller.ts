import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Req() request: Request) {
		return request.user;
	}
}
