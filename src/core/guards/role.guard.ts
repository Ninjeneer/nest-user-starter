import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'src/core/user/entities/user.entity';

/**
 * This guards avoid users not having specified roles from accessing routes
 */
@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector, private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		// If no role is provided
		if (!requiredRoles) {
			return true;
		}
		return requiredRoles.map((r) => r.toString()).includes(request.user.role);
	}
}
