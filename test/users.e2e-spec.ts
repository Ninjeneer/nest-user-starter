import chai, { expect } from 'chai';

import HttpClient from './HttpClient';
import { HttpStatus } from '@nestjs/common';
import Utils from '../src/utils';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

const httpClient = new HttpClient(Utils.buildServerURL());

describe('UserController (e2e)', function () {
	this.timeout(500000);

	before(async () => {
		const response = await httpClient.post<any>('/auth/login', { email: 'test@test.com', password: 'Azerty123!' });
		if (response.status === HttpStatus.OK) {
			httpClient.setToken(response.body.token);
		}
	});

	it('Should not be able to retrieve user list (/users)', async () => {
		const response = await httpClient.withoutToken().get('/users');
		expect(response.status).to.be.eq(HttpStatus.UNAUTHORIZED);
	});

	it('Should not be able to retrieve user list as basic user (/users)', async () => {
		const response = await httpClient.get('/users');
		expect(response.status).to.be.eq(HttpStatus.FORBIDDEN);
	});
});
