import { User } from '@prisma/client';
import { internet } from 'faker';

export default class UserFactory {
	public static buildOne(): Partial<User> {
		return {
			email: internet.email(),
			password: internet.password()
		};
	}

	public static buildMany(n: number): Partial<User>[] {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(UserFactory.buildOne());
		}
		return res;
	}
}
