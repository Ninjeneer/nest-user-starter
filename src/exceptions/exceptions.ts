import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailAlreadyUsedException extends HttpException {
	constructor() {
		super('Email already used', HttpStatus.CONFLICT);
	}
}