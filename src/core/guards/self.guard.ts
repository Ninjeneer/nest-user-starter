import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserRole } from '../user/entities/user.entity';

/**
 * This guard avoid users from calling ID based routes on IDs that differs from their
 * Administrators are not concerned
 */
@Injectable()
export class SelfGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		if (request.user.role === UserRole.ADMIN || request.user.id === request.params.id) {
			return true;
		}
		throw new ForbiddenException();
	}
}
