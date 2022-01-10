import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';
import { UserService } from '../user/user.service';

/**
 * this guards avoid users without token from calling routes
 * Also bind the user in the request object
 */
@Injectable()
export class TokenGuard implements CanActivate {
	constructor(private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const authorization = request.headers.authorization;

		// Check header presence
		if (authorization) {
			// Extract token
			const token = authorization.replace(new RegExp(/Bearer /i), '').trim();
			// Retrieve user based on provided token
			const user = await this.userService.findOneByToken(token);
			if (!user) {
				throw new UnauthorizedException();
			} else {
				Object.assign(request, { user });
				Object.assign(request, { token });
				return true;
			}
		} else {
			throw new UnauthorizedException();
		}
	}
}
