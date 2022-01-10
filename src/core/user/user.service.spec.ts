import 'mocha';

import { EmailAlreadyUsedException, UserDoesNotExistException } from '../exceptions/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import chai, { expect } from 'chai';

import { PrismaService } from '../../prisma.service';
import { SecurityModule } from '../security/security.module';
import UserFactory from './user.factory';
import { UserService } from './user.service';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';
import User from './entities/user.entity';
import UserRepository from './user.repository';

chai.use(chaiSubset);
chai.use(chaiAsPromised);

const createdUsers: User[] = [];

async function createUser(userService: UserService) {
	const user = UserFactory.buildOne();
	const createdUser = await userService.create({
		email: user.email,
		password: user.password
	});
	expect(createdUser.password).to.not.be.eq(user.password);
	delete user.password;
	expect(createdUser).containSubset(user);
	createdUsers.push(createdUser);
	return createdUser;
}

describe('UserService', () => {
	let userService: UserService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [SecurityModule],
			providers: [UserService, PrismaService, UserRepository]
		}).compile();

		userService = module.get<UserService>(UserService);
	});

	afterEach(async () => {
		for (const user of createdUsers) {
			try {
				await userService.remove(user.id);
			} catch (e) {}
		}
		//await module.get(PrismaService).$disconnect();
		await module.close();
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

		it('Should not create a user without email', async () => {
			const user = UserFactory.buildOne();
			delete user.email;

			await expect(
				userService.create({
					email: user.email,
					password: user.password
				})
			).to.be.rejectedWith(Error);
		});

		it('Should not create a user with an existing email', async () => {
			const user = await createUser(userService);
			await expect(
				userService.create({
					email: user.email,
					password: user.password
				})
			).to.be.rejectedWith(EmailAlreadyUsedException);
		});
	});

	describe('find', () => {
		it('Should find the created user', async () => {
			const user = await createUser(userService);
			delete user.password;
			expect(await userService.findOne(user.id)).containSubset(user);
		});

		it('Should not find an invalid user', async () => {
			expect(await userService.findOne('invalid_id')).to.be.null;
		});
	});

	describe('update', () => {
		it('Should update the created user', async () => {
			const user = await createUser(userService);
			const newUserData = UserFactory.buildOne();
			const updatedUser = await userService.update(user.id, {
				email: newUserData.email,
				password: newUserData.password
			});
			delete updatedUser.password;
			delete newUserData.password;
			expect(updatedUser).containSubset(newUserData);
		});

		it('Should not update a user with an existing email', async () => {
			const user = await createUser(userService);
			const user2 = await createUser(userService);
			await expect(userService.update(user.id, { email: user2.email })).to.be.rejectedWith(EmailAlreadyUsedException);
		});

		it('Should not update an invalid user', async () => {
			const newUserData = UserFactory.buildOne();
			await expect(userService.update('invalid_user', { email: newUserData.email })).to.be.rejectedWith(
				UserDoesNotExistException
			);
		});
	});

	describe('remove', () => {
		it('Should delete the created user', async () => {
			const user = await createUser(userService);
			await userService.remove(user.id);
			expect(await userService.findOne(user.id)).to.be.null;
		});

		it('Should not delete an invalid user', async () => {
			await expect(userService.remove('invalid_user')).to.be.rejectedWith(UserDoesNotExistException);
		});
	});
});
