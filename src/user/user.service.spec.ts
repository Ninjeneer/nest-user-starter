import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import UserFactory from './user.factory';
import { UserService } from './user.service';
import { assert } from 'console';

const createdUsers: User[] = [];

async function createUser(userService: UserService) {
	const user = UserFactory.buildOne();
	const createdUser = await userService.create({
		email: user.email,
		password: user.password
	});
	expect(createdUser).toMatchObject(user);
	createdUsers.push(createdUser);
	return createdUser;
}

describe('UserService', () => {
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService, PrismaService]
		}).compile();

		userService = module.get<UserService>(UserService);
	});

	afterAll(async () => {
		for (const user of createdUsers) {
			try {
				await userService.remove(user.id);
			} catch (e) {}
		}
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
	});

	describe('findAll', () => {
		it('Should return an array of users', async () => {
			expect(await userService.findAll()).toBeInstanceOf(Array);
		});
	});

	describe('create', () => {
		it('Should create a user', async () => {
			await createUser(userService);
		});

		it('Should not create a user', async () => {
			const user = UserFactory.buildOne();
			delete user.email;

			try {
				await userService.create({
					email: user.email,
					password: user.password
				});
				assert(false);
			} catch (e) {
				expect(e).toBeInstanceOf(Error);
			}
		});
	});

	describe('find', () => {
		it('Should find the created user', async () => {
			const user = await createUser(userService);
			expect(await userService.findOne(user.id)).toEqual(user);
		});

		it('Should not find an invalid user', async () => {
			expect(await userService.findOne('invalid_id')).toBeNull;
		});
	});

	describe('update', () => {
		it('Should update the created user', async () => {
			const user = await createUser(userService);
			const newUserData = UserFactory.buildOne();
			expect(await userService.update(user.id, newUserData)).toMatchObject(
				newUserData
			);
		});

		it('Should not update an invalid user', async () => {
			const newUserData = UserFactory.buildOne();
			try {
				await userService.update('invalid_user', newUserData);
			} catch (e) {
				expect(e).toBeInstanceOf(Error);
			}
		});
	});

	describe('remove', () => {
		it('Should delete the created user', async () => {
			const user = await createUser(userService);
			expect(await userService.remove(user.id)).toMatchObject(user);
			expect(await userService.findOne(user.id)).toBeNull;
		});

		it('Should not delete an invalid user', async () => {
			try {
				await userService.remove('invalid_user');
			} catch (e) {
				expect(e).toBeInstanceOf(Error);
			}
		});
	});
});
