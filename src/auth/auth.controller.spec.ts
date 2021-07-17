import { Test, TestingModule } from '@nestjs/testing';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
			imports: [UserModule, TokenModule]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
