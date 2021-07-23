import { Prisma, Token } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Generate a random token value
	 * @returns random string
	 */
	private generateToken(): string {
		const rand = () => Math.random().toString(36).substr(2);
		return rand() + rand();
	}

	/**
	 * Create a token for a user
	 * Doesn't insert automatically in database
	 * @param expiresAt expiracy date
	 * @returns created token
	 */
	create(expiresAt?: Date): Prisma.TokenCreateWithoutUserInput {
		return {
			expiresAt,
			value: this.generateToken(),
			createdAt: new Date()
		};
	}

	/**
	 * Get the latest token for a given user
	 * @param where where condition
	 * @returns Null or latest token
	 */
	async getLatestTokenOfUser(where: Prisma.TokenWhereInput): Promise<Token> {
		return await this.prisma.token.findFirst({
			where,
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	/**
	 * Revoke one or several tokens
	 * @param where where condition
	 * @returns number of revoked tokens
	 */
	async revoke(where: Prisma.TokenWhereInput): Promise<number> {
		return await (
			await this.prisma.token.deleteMany({ where })
		).count;
	}
}
