import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole, UserService } from '../user/user.service';

import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

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
