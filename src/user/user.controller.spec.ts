import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';
import { SecurityModule } from '../security/security.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
	let userController: UserController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SecurityModule],
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
