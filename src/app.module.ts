import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SecurityService } from './security/security.service';
import { SecurityModule } from './security/security.module';

@Module({
	imports: [UserModule, AuthModule, SecurityModule],
	controllers: [],
	providers: [SecurityService]
})
export class AppModule {}
