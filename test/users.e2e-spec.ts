import chai, { expect } from 'chai';

import HttpClient from './HttpClient';
import { HttpStatus } from '@nestjs/common';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

const BASE_URL = 'http://localhost:3000';
const httpClient = new HttpClient(BASE_URL);

describe('UserController (e2e)', () => {
	it('Should not be able to retrieve user list (/users)', async () => {
		const response = await httpClient.get('/users');
		expect(response.status).to.be.eq(HttpStatus.UNAUTHORIZED);
	});

	it('Should be able to retrieve user list (/users)', async () => {
		const response = await httpClient.get('/users');
		expect(response.status).to.be.eq(HttpStatus.UNAUTHORIZED);
	});
});
