declare namespace Express {
	import { User } from 'prisma/prisma-client';
	interface Request {
		token: string;
		user: User;
	}
}
