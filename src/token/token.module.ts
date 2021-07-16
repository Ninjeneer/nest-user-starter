import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TokenService } from './token.service';

@Module({
	providers: [TokenService, PrismaService],
	exports: [TokenService]
})
export class TokenModule {}
