import { Prisma, Token, User } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenService {
	constructor(private prisma: PrismaService) {}

	private generateToken(): string {
		const rand = () => Math.random().toString(36).substr(2);
		return rand() + rand();
	}

	create(expiresAt?: Date): Prisma.TokenCreateWithoutUserInput {
		return {
			expiresAt,
			value: this.generateToken(),
			createdAt: new Date()
		};
	}

	async getLatestTokenOfUser(where: Prisma.TokenWhereInput): Promise<Token> {
		return await this.prisma.token.findFirst({
			where,
			orderBy: {
				createdAt: 'desc'
			}
		});
	}
}
