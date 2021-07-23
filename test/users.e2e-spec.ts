import chai, { expect } from 'chai';

import HttpClient from './HttpClient';
import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import UserFactory from '../src/user/user.factory';
import Utils from '../src/utils';
import chaiSubset from 'chai-subset';
import config from '../src/assets/config.json';

chai.use(chaiSubset);

const httpClient = new HttpClient(Utils.buildServerURL());
const createdUsers: User[] = [];

describe('UserController (e2e)', function () {
	this.timeout(500000);

	describe('As basic user', () => {
		before(async () => {
			httpClient.user = (await httpClient.logAsBasic()).body;
		});

		it('Should not be able to retrieve user list without being logged (GET /users)', async () => {
			const response = await httpClient.withoutToken().get('/users');
			expect(response.status).to.be.eq(HttpStatus.UNAUTHORIZED);
		});

		it('Should not be able to retrieve user list (GET /users)', async () => {
			const response = await httpClient.get('/users');
			expect(response.status).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should be able to find himself (GET /users/:id)', async () => {
			const response = await httpClient.get<User>(`/users/${httpClient.user.id}`);
			expect(response.status).to.be.eq(HttpStatus.OK);
			expect(response.body).to.be.deep.eq(httpClient.getUser());
		});

		it('Should be able to update himself (UPDATE /users/:id)', async () => {
			const newUserData = UserFactory.buildOne();
			delete newUserData.password;
			let response = await httpClient.patch<User>(`/users/${httpClient.getUser().id}`, newUserData);
			expect(response.status).to.be.eq(HttpStatus.OK);
			expect(response.body.email).to.be.eq(newUserData.email);

			// Set back email
			response = await httpClient.patch<User>(`/users/${httpClient.getUser().id}`, { email: config.tests.basic.email });
			expect(response.status).to.be.eq(HttpStatus.OK);
		});

		it('Should not be able to update himself with an invalid email (UPDATE /users/:id)', async () => {
			const newUserData = { email: 'invalid_email' };
			const response = await httpClient.patch<User>(`/users/${httpClient.getUser().id}`, newUserData);
			expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should not be able to update another user (UPDATE /users/:id)', async () => {
			const newUserData = UserFactory.buildOne();
			const response = await httpClient.patch<User>(`/users/another_id`, newUserData);
			expect(response.status).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to delete another user (DELETE /users/:id)', async () => {
			const newUserData = UserFactory.buildOne();
			const response = await httpClient.delete<User>(`/users/another_id`, newUserData);
			expect(response.status).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to create a user (POST /users)', async () => {
			const user = UserFactory.buildOne();
			const response = await httpClient.post<User>('/users', user);
			expect(response.status).to.be.eq(HttpStatus.FORBIDDEN);
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

		it('Should be able to create a user (POST /users)', async () => {
			const user = UserFactory.buildOne();
			const response = await httpClient.post<User>('/users', user);
			expect(response.status).to.be.eq(HttpStatus.CREATED);
			expect(response.body.email).to.be.eq(user.email);
			createdUsers.push(response.body);
		});

		it('Should not be able to create a user without email (POST /users)', async () => {
			const user = UserFactory.buildOne();
			delete user.email;
			const response = await httpClient.post<User>('/users', user);
			expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should not be able to create a user with existing email (POST /users)', async () => {
			const user = UserFactory.buildOne();
			let response = await httpClient.post<User>('/users', user);
			expect(response.status).to.be.eq(HttpStatus.CREATED);
			createdUsers.push({ password: user.password, ...response.body });

			response = await httpClient.post<User>('/users', { ...createdUsers[createdUsers.length - 1] });
			expect(response.status).to.be.eq(HttpStatus.CONFLICT);
		});

		it('Should not be able to create a user with short password (POST /users)', async () => {
			const user = UserFactory.buildOne();
			user.password = '123';
			const response = await httpClient.post<User>('/users', user);
			expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should be able to update a user (PATCH /users/:id)', async () => {
			// Create a user
			const user = UserFactory.buildOne();
			let response = await httpClient.post<User>('/users', { ...user });
			expect(response.status).to.be.eq(HttpStatus.CREATED);
			createdUsers.push(response.body);

			// Update it
			const newUserData = UserFactory.buildOne();
			response = await httpClient.patch<User>(`/users/${createdUsers[createdUsers.length - 1].id}`, newUserData);
			expect(response.status).to.be.eq(HttpStatus.OK);
			expect(response.body.email).to.be.eq(newUserData.email);
		});

		it('Should not be able to update a user with a short password (PATCH /users/:id)', async () => {
			// Create a user
			const user = UserFactory.buildOne();
			let response = await httpClient.post<User>('/users', { ...user });
			expect(response.status).to.be.eq(HttpStatus.CREATED);
			createdUsers.push(response.body);

			// Update it
			const newUserData = UserFactory.buildOne();
			newUserData.password = '123';
			response = await httpClient.patch<User>(`/users/${createdUsers[createdUsers.length - 1].id}`, newUserData);
			expect(response.status).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should be able to delete a user (DELETE /users/:id)', async () => {
			// Create a user
			const user = UserFactory.buildOne();
			let response = await httpClient.post<User>('/users', { ...user });
			expect(response.status).to.be.eq(HttpStatus.CREATED);
			createdUsers.push(response.body);

			// Delete it
			response = await httpClient.delete<User>(`/users/${createdUsers[createdUsers.length - 1].id}`);
			expect(response.status).to.be.eq(HttpStatus.OK);

			response = await httpClient.get<User>(`/users/${createdUsers[createdUsers.length - 1].id}`);
			expect(response.status).to.be.eq(HttpStatus.NOT_FOUND);
			createdUsers.pop();
		});
	});

	after(async () => {
		await httpClient.logAsAdmin();
		for (const user of createdUsers) {
			const response = await httpClient.delete(`/users/${user.id}`);
			expect(response.status).to.be.eq(HttpStatus.OK);
		}
	});
});
