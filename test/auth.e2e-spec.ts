// import chai, { expect } from 'chai';

// import HttpClient from './HttpClient';
// import { HttpStatus } from '@nestjs/common';
// import LoggedUserEntity from '../src/auth/entities/user-logged.entity';
// import User from '../src/user/entities/user.entity';
// import UserFactory from '../src/user/user.factory';
// import Utils from '../src/utils';
// import chaiSubset from 'chai-subset';
// import config from '../src/assets/config.json';

// chai.use(chaiSubset);

// const httpClient = new HttpClient(Utils.buildServerURL());
// const createdUsers: User[] = [];

// describe('AuthController (e2e)', function () {
// 	this.timeout(500000);

// 	it('Should register a new user (POST /auth/register)', async () => {
// 		const user = UserFactory.buildOne();
// 		const response = await httpClient.post<LoggedUserEntity>('/auth/register', user);
// 		expect(response.status).to.be.eq(HttpStatus.CREATED);
// 		expect(response.body).to.containSubset({ email: user.email });
// 		expect(response.body.token).to.exist;
// 		createdUsers.push(response.body);
// 	});

// 	it('Should not register a new user with existing email (POST /auth/register)', async () => {
// 		const response = await httpClient.post<LoggedUserEntity>('/auth/register', {
// 			email: config.tests.admin.email,
// 			password: config.tests.admin.password
// 		});
// 		expect(response.status).to.be.eq(HttpStatus.CONFLICT);
// 	});

// 	it('Should not register a new user with a short password (POST /auth/register)', async () => {
// 		const user = UserFactory.buildOne();
// 		user.password = '123';
// 		const response = await httpClient.post<LoggedUserEntity>('/auth/register', user);
// 		expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);
// 	});

// 	it('Should not register a new user with invalid information (POST /auth/register)', async () => {
// 		let response = await httpClient.post<LoggedUserEntity>('/auth/register', {});
// 		expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);

// 		response = await httpClient.post<LoggedUserEntity>('/auth/register', { email: 'aaa@aaaa.aa' });
// 		expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);

// 		response = await httpClient.post<LoggedUserEntity>('/auth/register', { password: '65e6r54ge65rg4' });
// 		expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);
// 	});

// 	it('Should log in (POST /auth/login)', async () => {
// 		const user = UserFactory.buildOne();
// 		let response = await httpClient.post<LoggedUserEntity>('/auth/register', user);
// 		expect(response.status).to.be.eq(HttpStatus.CREATED);
// 		createdUsers.push(response.body);

// 		response = await httpClient.logAs(user.email, user.password);
// 		expect(response.status).to.be.eq(HttpStatus.OK);
// 		expect(response.body).to.containSubset({ email: user.email });
// 		expect(response.body.token).to.exist;
// 	});

// 	it('Should not log in with unknown account (POST /auth/login)', async () => {
// 		const response = await httpClient.logAs('unknown@email.com', '5e4r65g4erg54');
// 		expect(response.status).to.be.eq(HttpStatus.UNAUTHORIZED);
// 		expect(response.body.token).to.not.exist;
// 	});

// 	it('Should log out (POST /auth/logout)', async () => {
// 		const user = UserFactory.buildOne();
// 		let response = await httpClient.post<LoggedUserEntity>('/auth/register', user);
// 		expect(response.status).to.be.eq(HttpStatus.CREATED);
// 		httpClient.setToken(response.body.token);
// 		createdUsers.push(response.body);

// 		response = await httpClient.post('/auth/logout');
// 		expect(response.status).to.be.eq(HttpStatus.OK);
// 	});

// 	after(async () => {
// 		await httpClient.logAsAdmin();
// 		for (const user of createdUsers) {
// 			const response = await httpClient.delete(`/users/${user.id}`);
// 			expect(response.status).to.be.eq(HttpStatus.OK);
// 		}
// 	});
// });
