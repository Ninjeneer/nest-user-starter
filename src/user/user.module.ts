import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityModule } from '../security/security.module';
import { TokenModule } from '../token/token.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [SecurityModule, TokenModule],
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService]
})
export class UserModule {}
