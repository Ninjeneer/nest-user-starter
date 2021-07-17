import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { TokenService } from './token.service';
import * as faker from 'faker';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, PrismaService],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

	it('Shoud create a token without expiracy', () => {
		const token = tokenService.create();
		expect(token.expiresAt).toBeNull;
	});

	it('Shoud create a token with expiracy', () => {
		const date = faker.date.future();
		const token = tokenService.create(date);
		expect(token.expiresAt).toEqual(date);
	});
});
