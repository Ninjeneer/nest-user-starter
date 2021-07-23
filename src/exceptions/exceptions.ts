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
