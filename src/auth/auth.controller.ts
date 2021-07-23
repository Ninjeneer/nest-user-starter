import { Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { TokenGuard } from '../guards/token.guard';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { ApiBody, ApiOkResponse, ApiProperty, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import LoginDTO from './dto/login.dto';
import LoggedUserEntity from './entities/user-logged.entity';
import RegisterDTO from './dto/register.dto';
import UserEntity from 'src/user/entities/UserEntity';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private userService: UserService, private tokenService: TokenService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	@HttpCode(200)
	@ApiBody({ type: LoginDTO })
	@ApiOkResponse({ description: 'Successfully logged in', type: LoggedUserEntity })
	@ApiUnauthorizedResponse({ description: 'Failed to log in' })
	async login(@Req() request: Request) {
		return request.user;
	}

	@Post('register')
	@ApiBody({ type: RegisterDTO })
	@ApiOkResponse({ description: 'Successfully registered', type: UserEntity })
	async register(@Req() request: Request) {
		return this.userService.create(request.body);
	}

	@Post('logout')
	@UseGuards(TokenGuard)
	@ApiOkResponse({ description: 'Successfully logged out' })
	async logout(@Req() request: Request) {
		this.tokenService.revoke({ value: request.token });
	}
}
