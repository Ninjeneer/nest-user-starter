import { Module } from '@nestjs/common';
import { AuthModule } from '../../core/auth/auth.module';
import { UserModule } from '../../core/user/user.module';
import { AuthController } from './auth.controller';

@Module({
	controllers: [AuthController],
	imports: [AuthModule, UserModule]
})
export class AuthApiModule {}
