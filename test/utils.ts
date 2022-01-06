import { NestFastifyApplication } from '@nestjs/platform-fastify';
import User from '../src/user/entities/user.entity';
import UserFactory from '../src/user/user.factory';
import { UserRole, UserService } from '../src/user/user.service';
import HttpClient from './HttpClient';

export default class TestUtils {
	public static async createBasicAndAdminUsers(userService: UserService): Promise<{ basic: User; admin: User }> {
		const basic = UserFactory.buildOne();
		const admin = UserFactory.buildOne();
		admin.role = UserRole.ADMIN;

		const createdBasic = await userService.create(basic);
		const createdAdmin = await userService.create(admin);
		createdBasic.password = basic.password;
		createdAdmin.password = admin.password;

		return { basic: createdBasic, admin: createdAdmin };
	}
}

export async function getHttpClient(user: User, app: NestFastifyApplication): Promise<HttpClient> {
	const httpClient = new HttpClient(app);
	await httpClient.logAsUser(user);
	return httpClient;
}
