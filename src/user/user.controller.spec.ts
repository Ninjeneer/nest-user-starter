import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';
import { UserController } from './user.controller';
import UserFactory from './user.factory';
import { UserService } from './user.service';

describe('UserController', () => {
	let userController: UserController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService, PrismaService]
		}).compile();
		userController = module.get<UserController>(UserController);
	});

	it('should be defined', () => {
		expect(userController).toBeDefined();
	});

	describe('findAll', () => {
		it('Should return an array of users', async () => {
			expect(await userController.findAll()).toBeInstanceOf(Array);
		});
	});
});
