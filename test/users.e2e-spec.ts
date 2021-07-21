import chai, { expect } from 'chai';

import HttpClient from './HttpClient';
import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import Utils from '../src/utils';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

const httpClient = new HttpClient(Utils.buildServerURL());

describe('UserController (e2e)', function () {
	this.timeout(500000);

	describe('As basic user', () => {
		before(async () => {
			httpClient.user = (await httpClient.logAsBasic()).body;
		});

		it('Should not be able to retrieve user list without being logged(/users)', async () => {
			const response = await httpClient.withoutToken().get('/users');
			expect(response.status).to.be.eq(HttpStatus.UNAUTHORIZED);
		});

		it('Should not be able to retrieve user list (/users)', async () => {
			const response = await httpClient.get('/users');
			expect(response.status).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should be able to retrieve himself (/users/:id)', async () => {
			const response = await httpClient.get<User>(`/users/${httpClient.user.id}`);
			expect(response.status).to.be.eq(HttpStatus.OK);
			expect(response.body).to.be.deep.eq(httpClient.getUser());
		});
	});

	describe('As admin user', () => {
		before(async () => {
			await httpClient.logAsAdmin();
		});

		it('Should be able to retrieve user list (/users)', async () => {
			const response = await httpClient.get<User[]>('/users');
			expect(response.status).to.be.eq(HttpStatus.OK);
			expect(response.body).to.be.instanceOf(Array);
			expect(response.body.length).to.be.gt(0);
		});
	});
});
