import { Module } from '@nestjs/common';
import { UserModule } from '../../core/user/user.module';
import { UserController } from './user.controller';

@Module({
	controllers: [UserController],
	imports: [UserModule]
})
export class UserApiModule {}
