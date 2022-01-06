import { internet } from 'faker';
import User from './entities/user.entity';

export default class UserFactory {
	public static buildOne(): User {
		return {
			email: internet.email().toLowerCase(),
			password: internet.password()
		} as User;
	}

	public static buildMany(n: number): User[] {
		const res = [];
		for (let i = 0; i < n; i++) {
			res.push(UserFactory.buildOne());
		}
		return res;
	}
}
