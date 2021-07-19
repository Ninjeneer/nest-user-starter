import { Injectable } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { TokenService } from '../token/token.service';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private securityService: SecurityService,
		private tokenService: TokenService
	) {}

	async validateUser(email: string, password: string): Promise<Partial<User>> {
		let user = await this.userService.findOneByEmail(email);
		if (user && this.securityService.comparePasswords(password, user.password)) {
			// Generate a token for the user
			user = await this.userService.update({ id: user.id }, { tokens: { create: [this.tokenService.create()] } });
			// Delete the password from the response
			delete user.password;
			// Add the latest token to the response
			Object.assign(user, { token: (await this.tokenService.getLatestTokenOfUser({ userID: user.id })).value });
			return user;
		}
		return null;
	}
}
