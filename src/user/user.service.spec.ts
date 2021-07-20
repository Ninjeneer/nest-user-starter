import 'mocha';

import { Test, TestingModule } from '@nestjs/testing';
import chai, { expect } from 'chai';

import { PrismaService } from '../prisma.service';
import { SecurityModule } from '../security/security.module';
import { User } from '@prisma/client';
import UserFactory from './user.factory';
import { UserService } from './user.service';
import { assert } from 'console';
import chaiSubset from 'chai-subset'

chai.use(chaiSubset);

const createdUsers: User[] = [];

async function createUser(userService: UserService) {
	const user = UserFactory.buildOne();
	const createdUser = await userService.create({
		email: user.email,
		password: user.password
	});
	delete user.password;
	expect(createdUser).containSubset(user);
	createdUsers.push(createdUser);
	return createdUser;
}

describe('UserService', () => {
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SecurityModule],
			providers: [UserService, PrismaService]
		}).compile();

		userService = module.get<UserService>(UserService);
	});

	afterEach(async () => {
		for (const user of createdUsers) {
			try {
				await userService.remove(user.id);
			} catch (e) {}
		}
	});

	it('should be defined', () => {
		expect(userService).to.not.be.null;
	});

	describe('findAll', () => {
		it('Should return an array of users', async () => {
			expect(await userService.findAll()).to.be.instanceOf(Array);
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
				expect(e).to.be.instanceOf(Error);
			}
		});
	});

	describe('find', () => {
		it('Should find the created user', async () => {
			const user = await createUser(userService);
			delete user.password;
			expect(await userService.findOne({ id: user.id })).containSubset(user);
		});

		it('Should not find an invalid user', async () => {
			expect(await userService.findOne({ id: 'invalid_id' })).to.be.null;
		});
	});

	describe('update', () => {
		it('Should update the created user', async () => {
			const user = await createUser(userService);
			delete user.password;
			const newUserData = UserFactory.buildOne();
			expect(await userService.update({ id: user.id }, newUserData)).containSubset(newUserData);
		});

		it('Should not update an invalid user', async () => {
			const newUserData = UserFactory.buildOne();
			try {
				await userService.update({ id: 'invalid_user' }, newUserData);
			} catch (e) {
				expect(e).to.be.instanceOf(Error);
			}
		});
	});

	describe('remove', () => {
		it('Should delete the created user', async () => {
			const user = await createUser(userService);
			expect(await userService.remove(user.id)).containSubset(user);
			expect(await userService.findOne({ id: user.id })).to.be.null;
		});

		it('Should not delete an invalid user', async () => {
			try {
				await userService.remove('invalid_user');
			} catch (e) {
				expect(e).to.be.instanceOf(Error);
			}
		});
	});
});
