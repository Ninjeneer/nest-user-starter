import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { SecurityService } from './security/security.service';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [UserModule, AuthModule, SecurityModule, TokenModule],
	controllers: [],
	providers: [SecurityService]
})
export class AppModule {}
