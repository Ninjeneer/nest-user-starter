import 'mocha';

import { Test, TestingModule } from '@nestjs/testing';
import chai, { expect } from 'chai';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { SecurityModule } from '../security/security.module';
import UserFactory from '../user/user.factory';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import chaiSubset from 'chai-subset';
import chaiExclude from 'chai-exclude';

chai.use(chaiSubset);
chai.use(chaiExclude);

describe('AuthService', function () {
	this.timeout(1000000);
	let authService: AuthService;
	let userService: UserService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [UserModule, AuthModule, SecurityModule],
			providers: [AuthService]
		}).compile();

		authService = module.get<AuthService>(AuthService);
		userService = module.get<UserService>(UserService);
	});

	afterEach(async () => {
		//await module.get(PrismaService).$disconnect();
		await module.close();
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
			delete createdUser.token;
			delete createdUser.updatedAt;
			// Log as user
			expect(await authService.validateUser(user.email, user.password))
				.excluding('updatedAt')
				.containSubset(createdUser)
				.excluding('updatedAt');
		});
	});

	describe('validateUser', () => {
		it('Should not find any user', async () => {
			expect(await authService.validateUser('invalid@email.com', 'Azerty123')).to.be.null;
		});
	});
});
