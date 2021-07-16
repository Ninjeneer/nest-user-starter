import { Injectable } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private securityService: SecurityService) {}

	async validateUser(email: string, password: string): Promise<Partial<User>> {
		const user = await this.userService.findOneByEmail(email);
		if (user && this.securityService.comparePasswords(password, user.password)) {
			delete user.password;
			return user;
		}
		return null;
	}
}
