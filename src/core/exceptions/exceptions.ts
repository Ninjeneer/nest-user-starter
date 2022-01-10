import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyUsedException extends HttpException {
	constructor() {
		super('Email already used', HttpStatus.CONFLICT);
	}
}

export class UserDoesNotExistException extends HttpException {
	constructor() {
		super('User does not exist', HttpStatus.NOT_FOUND);
	}
}

export class ForbiddenBasicException extends HttpException {
	constructor(actions?: string[]) {
		super('Basic user cannot perform such action' + (actions ? `s : [${actions}]` : '.'), HttpStatus.FORBIDDEN);
	}
}

export enum ForbiddenBasicActions {
	UPDATE_ROLE = 'Update its own role'
}
