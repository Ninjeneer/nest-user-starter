import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RoleGuard } from '../guards/role.guard';
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
