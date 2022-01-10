import chai, { expect } from 'chai';

import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import UserFactory from '../src/core/user/user.factory';
import { UserService } from '../src/core/user/user.service';
import chaiSubset from 'chai-subset';
import { AuthModule } from '../src/core/auth/auth.module';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import TestUtils, { getHttpClient } from './utils';
import { UserRole } from '../src/core/user/entities/user.entity';
import { UserApiModule } from '../src/api/user-api/user-api.module';
import { AuthApiModule } from '../src/api/auth-api/auth-api.module';
import { UserModule } from '../src/core/user/user.module';

chai.use(chaiSubset);

const createdUsers: User[] = [];

describe('UserController (e2e)', function () {
	this.timeout(500000);

	let app: NestFastifyApplication;
	let userService: UserService;
	let users;

	this.beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [UserApiModule, AuthModule, AuthApiModule, UserModule]
		}).compile();
		app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
		app.useGlobalPipes(new ValidationPipe());

		await app.init();
		await app.getHttpAdapter().getInstance().ready();
		userService = app.get<UserService>(UserService);
		users = await TestUtils.createBasicAndAdminUsers(userService);
	});

	describe('As basic user', () => {
		it('Should not be able to retrieve user list without being logged (GET /users)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.withoutToken().get('/users');
			expect(response.statusCode).to.be.eq(HttpStatus.UNAUTHORIZED);
		});

		it('Should not be able to retrieve user list (GET /users)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.get('/users');
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should be able to find himself (GET /users/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const response = await httpClient.get(`/users/${httpClient.user.id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<User>()).to.containSubset(httpClient.getUser());
		});

		it('Should be able to update himself (UPDATE /users/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const newUserData = UserFactory.buildOne();
			delete newUserData.password;
			const response = await httpClient.patch(`/users/${httpClient.getUser().id}`, newUserData);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<User>().email).to.be.eq(newUserData.email);
		});

		it('Should not be able to update himself his role (UPDATE /users/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const newUserData = UserFactory.buildOne();
			delete newUserData.password;
			newUserData.role = UserRole.ADMIN;
			const response = await httpClient.patch(`/users/${httpClient.getUser().id}`, newUserData);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to update himself with an invalid email (UPDATE /users/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const newUserData = { email: 'invalid_email' };
			const response = await httpClient.patch(`/users/${httpClient.getUser().id}`, newUserData);
			expect(response.statusCode).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should not be able to update another user (UPDATE /users/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const newUserData = UserFactory.buildOne();
			const response = await httpClient.patch(`/users/another_id`, newUserData);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to delete another user (DELETE /users/:id)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const newUserData = UserFactory.buildOne();
			const response = await httpClient.delete(`/users/another_id`, newUserData);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});

		it('Should not be able to create a user (POST /users)', async () => {
			const httpClient = await getHttpClient(users.basic, app);
			const user = UserFactory.buildOne();
			const response = await httpClient.post('/users', user);
			expect(response.statusCode).to.be.eq(HttpStatus.FORBIDDEN);
		});
	});

	describe('As admin user', () => {
		it('Should be able to retrieve user list (/users)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const response = await httpClient.get('/users');
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<User[]>()).to.be.instanceOf(Array);
			expect(response.json<User[]>().length).to.be.gt(0);
		});

		it('Should be able to create a user (POST /users)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const user = UserFactory.buildOne();
			const response = await httpClient.post('/users', user);
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			expect(response.json<User>().email).to.be.eq(user.email);
			createdUsers.push(response.json<User>());
		});

		it('Should not be able to create a user without email (POST /users)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const user = UserFactory.buildOne();
			delete user.email;
			const response = await httpClient.post('/users', user);
			expect(response.statusCode).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should not be able to create a user with existing email (POST /users)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const user = UserFactory.buildOne();
			let response = await httpClient.post('/users', user);
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdUsers.push({ password: user.password, ...response.json<User>() });

			response = await httpClient.post('/users', { ...createdUsers[createdUsers.length - 1] });
			expect(response.statusCode).to.be.eq(HttpStatus.CONFLICT);
		});

		it('Should not be able to create a user with short password (POST /users)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			const user = UserFactory.buildOne();
			user.password = '123';
			const response = await httpClient.post('/users', user);
			expect(response.statusCode).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should be able to update a user (PATCH /users/:id)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			// Create a user
			const user = UserFactory.buildOne();
			let response = await httpClient.post('/users', { ...user });
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdUsers.push(response.json<User>());

			// Update it
			const newUserData = UserFactory.buildOne();
			response = await httpClient.patch(`/users/${createdUsers[createdUsers.length - 1].id}`, newUserData);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);
			expect(response.json<User>().email).to.be.eq(newUserData.email);
		});

		it('Should not be able to update a user with a short password (PATCH /users/:id)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			// Create a user
			const user = UserFactory.buildOne();
			let response = await httpClient.post('/users', { ...user });
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdUsers.push(response.json<User>());

			// Update it
			const newUserData = UserFactory.buildOne();
			newUserData.password = '123';
			response = await httpClient.patch(`/users/${createdUsers[createdUsers.length - 1].id}`, newUserData);
			expect(response.statusCode).to.be.eq(HttpStatus.BAD_REQUEST);
		});

		it('Should be able to delete a user (DELETE /users/:id)', async () => {
			const httpClient = await getHttpClient(users.admin, app);
			// Create a user
			const user = UserFactory.buildOne();
			let response = await httpClient.post('/users', { ...user });
			expect(response.statusCode).to.be.eq(HttpStatus.CREATED);
			createdUsers.push(response.json<User>());

			// Delete it
			response = await httpClient.delete(`/users/${createdUsers[createdUsers.length - 1].id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.OK);

			response = await httpClient.get(`/users/${createdUsers[createdUsers.length - 1].id}`);
			expect(response.statusCode).to.be.eq(HttpStatus.NOT_FOUND);
			createdUsers.pop();
		});
	});

	this.afterEach(async () => {
		const httpClient = await getHttpClient(users.admin, app);
		for (const user of createdUsers) {
			await httpClient.delete(`/users/${user.id}`);
		}
		await httpClient.delete(`/users/${users.basic.id}`);
		await httpClient.delete(`/users/${users.admin.id}`);
	});
});
