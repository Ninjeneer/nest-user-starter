import { AuthModule } from './core/auth/auth.module';
import { Module } from '@nestjs/common';
import { SecurityModule } from './core/security/security.module';
import { SecurityService } from './core/security/security.service';
import { UserModule } from './core/user/user.module';
import { UserApiModule } from './api/user-api/user-api.module';
import { AuthApiModule } from './api/auth-api/auth-api.module';

@Module({
	imports: [UserModule, AuthModule, SecurityModule, UserApiModule, AuthApiModule],
	controllers: [],
	providers: [SecurityService]
})
export class AppModule {}
