import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class TokenGuard implements CanActivate {

	constructor(private userService: UserService) {
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const authorization = request.headers.authorization;

		// Check header presence
		if (authorization) {
			// Extract token
			const token = authorization.replace(new RegExp(/Bearer /i), '');
			// Retrieve user based on provided token
			const user = await this.userService.findOneByToken({ tokens: { some: { value: token } } });
			return !!user;
		} else {
			return false;
		}
	}
}
