import 'mocha';

import { Test, TestingModule } from '@nestjs/testing';

import { SecurityService } from './security.service';
import { expect } from 'chai';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(service).to.not.be.null;
  });
});
