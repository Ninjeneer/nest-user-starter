import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SecurityService } from './security/security.service';
import { SecurityModule } from './security/security.module';
import { TokenModule } from './token/token.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './token.guard';

@Module({
	imports: [UserModule, AuthModule, SecurityModule, TokenModule],
	controllers: [],
	providers: [
		SecurityService,
		{
			provide: APP_GUARD,
			useClass: TokenGuard
		}
	
	]
})
export class AppModule {}
