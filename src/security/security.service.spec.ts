import 'mocha';

import { Test, TestingModule } from '@nestjs/testing';

import { SecurityService } from './security.service';
import { expect } from 'chai';

describe('SecurityService', () => {
	let service: SecurityService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			providers: [SecurityService]
		}).compile();

		service = module.get<SecurityService>(SecurityService);
	});

	afterEach(async () => await module.close());

	it('should be defined', () => {
		expect(service).to.not.be.null;
	});
});
