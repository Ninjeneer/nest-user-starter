import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SecurityModule } from '../security/security.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule, PassportModule, SecurityModule],
	providers: [AuthService, LocalStrategy],
	exports: [AuthService]
})
export class AuthModule {}
