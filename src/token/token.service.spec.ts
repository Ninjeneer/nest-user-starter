import 'mocha';

import * as faker from 'faker';

import { Test, TestingModule } from '@nestjs/testing';
import chai, { expect } from 'chai';

import { PrismaService } from '../prisma.service';
import { TokenService } from './token.service';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

describe('TokenService', () => {
	let tokenService: TokenService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			providers: [TokenService, PrismaService]
		}).compile();

		tokenService = module.get<TokenService>(TokenService);
	});

	afterEach(async () => await module.close());

	it('should be defined', () => {
		expect(tokenService).to.not.be.null;
	});

	it('Shoud create a token without expiracy', () => {
		const token = tokenService.create();
		expect(token.expiresAt).to.be.undefined;
	});

	it('Shoud create a token with expiracy', () => {
		const date = faker.date.future();
		const token = tokenService.create(date);
		expect(token.expiresAt).to.be.eq(date);
	});
});
