import { Injectable } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { UserService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import User from 'src/core/user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private securityService: SecurityService) {}

	async validateUser(email: string, password: string): Promise<User> {
		let user = await this.userService.findOneByEmail(email, true);
		if (user && this.securityService.comparePasswords(password, user.password)) {
			// Generate a token for the user
			user = await this.userService.addToken(user.id, this.generateToken());
			// Delete the password from the response
			delete user.password;
			// Add the latest token to the response
			return user;
		}
		return null;
	}

	private generateToken(): string {
		return uuidv4().replace(/-/g, '');
	}
}
