import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SecurityModule } from '../security/security.module';
import UserRepository from './user.repository';
import { UserService } from './user.service';

@Module({
	imports: [SecurityModule],
	providers: [UserService, UserRepository, PrismaService],
	exports: [UserService]
})
export class UserModule {}
