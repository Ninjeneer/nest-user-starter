import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenGuard } from '../guards/token.guard';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import LoginDTO from './dto/login.dto';
import LoggedUserEntity from './entities/user-logged.entity';
import RegisterDTO from './dto/register.dto';
import UserEntity from '../user/entities/UserEntity';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private userService: UserService, private tokenService: TokenService, private authService: AuthService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	@HttpCode(200)
	@ApiBody({ type: LoginDTO })
	@ApiOperation({ summary: 'Log in' })
	@ApiOkResponse({ description: 'Successfully logged in', type: LoggedUserEntity })
	@ApiUnauthorizedResponse({ description: 'Failed to log in' })
	async login(@Req() request: Request) {
		return request.user;
	}

	@Post('register')
	@ApiOperation({ summary: 'Register' })
	@ApiBody({ type: RegisterDTO })
	@ApiOkResponse({ description: 'Successfully registered', type: LoggedUserEntity })
	async register(@Body() registerDto: RegisterDTO) {
		const password = registerDto.password; // Protect from mutating password during user creation
		await this.userService.create(registerDto);
		return await this.authService.validateUser(registerDto.email, password);
	}

	@Post('logout')
	@UseGuards(TokenGuard)
	@HttpCode(200)
	@ApiOperation({ summary: 'Log out' })
	@ApiOkResponse({ description: 'Successfully logged out' })
	async logout(@Req() request: Request) {
		this.tokenService.revoke({ value: request.token });
	}
}
