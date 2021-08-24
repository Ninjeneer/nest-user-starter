declare namespace Express {
	import User from '../../src/user/entities/user.entity';
	interface Request {
		token: string;
		user: User;
	}
}
