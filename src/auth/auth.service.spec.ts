import 'mocha';

import { Test, TestingModule } from '@nestjs/testing';
import chai, { expect } from 'chai';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { SecurityModule } from '../security/security.module';
import { TokenModule } from '../token/token.module';
import UserFactory from '../user/user.factory';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

describe('AuthService', () => {
	let authService: AuthService;
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [UserModule, AuthModule, SecurityModule, TokenModule],
			providers: [AuthService]
		}).compile();

		authService = module.get<AuthService>(AuthService);
		userService = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(authService).to.not.be.null;
	});

	describe('login', () => {
		it('Should login successfully', async () => {
			const user = UserFactory.buildOne();
			// Create user
			const createdUser = await userService.create({ email: user.email, password: user.password });
			delete createdUser.password;
			// Log as user
			expect(await authService.validateUser(user.email, user.password)).containSubset(createdUser);
		});
	});
});
