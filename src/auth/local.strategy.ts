import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(username: string, password: string): Promise<Partial<User>> {
		const user = await this.authService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException();
		} else {
			return user;
		}
	}
}
