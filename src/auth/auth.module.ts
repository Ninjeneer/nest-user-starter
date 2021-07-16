import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SecurityModule } from '../security/security.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule, PassportModule, SecurityModule, TokenModule],
	providers: [AuthService, LocalStrategy],
	controllers: [AuthController]
})
export class AuthModule {}
