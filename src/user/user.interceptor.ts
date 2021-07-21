import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserService } from './user.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
	constructor(private userService: UserService) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const request: Request = context.switchToHttp().getRequest();
		const authorization = request.headers.authorization;

		// Check header presence
		if (authorization) {
			// Extract token
			const token = authorization.replace(new RegExp(/Bearer /i), '').trim();
			// Retrieve user based on provided token
			const user = await this.userService.findOneByToken(token);
			if (user) {
				request.user = user;
			}
		}
		return next.handle();
	}
}
