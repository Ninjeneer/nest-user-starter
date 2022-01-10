import { Chain } from 'light-my-request';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import User from 'src/core/user/entities/user.entity';

export default class HttpClient {
	private app: NestFastifyApplication;
	private withToken: boolean;

	private token: string;
	public user: User;

	constructor(app: NestFastifyApplication, withToken = true) {
		this.app = app;
		this.withToken = withToken;
	}

	private buildHeaders() {
		const headers = {};
		if (this.withToken) {
			Object.assign(headers, { authorization: this.token ? 'Bearer ' + this.token : '' });
		}
		return headers;
	}

	public setToken(token: string): void {
		this.token = token;
	}

	public withoutToken(): HttpClient {
		return new HttpClient(this.app, false);
	}

	public setUser(user: User) {
		this.user = user;
		this.setToken(user.token.toString());
	}

	public getUser(): User {
		const userCopy = JSON.parse(JSON.stringify(this.user));
		delete userCopy.password;
		delete userCopy.token;
		return userCopy;
	}

	private async send(
		method: any,
		url: string,
		payload?: Record<string, any>,
		params?: Record<string, any>
	): Promise<Chain> {
		return await this.app.inject({ method, url, payload, query: params, headers: this.buildHeaders() });
	}

	public async post(url: string, data?: Record<string, any>): Promise<Chain> {
		return this.send('POST', url, data);
	}

	public async get(url: string, params?: Record<string, any>): Promise<Chain> {
		return this.send('GET', url, {}, params);
	}

	public async put(url: string, data?: Record<string, any>, params?: Record<string, any>): Promise<Chain> {
		return this.send('PUT', url, data, params);
	}

	public async patch(url: string, data?: Record<string, any>, params?: Record<string, any>): Promise<Chain> {
		return this.send('PATCH', url, data, params);
	}

	public async delete(url: string, data?: Record<string, any>, params?: Record<string, any>): Promise<Chain> {
		return this.send('DELETE', url, data, params);
	}

	public async logAs(username?: string, password?: string): Promise<Chain> {
		const response = await this.post('/auth/login', { email: username, password: password });
		if (response.statusCode === HttpStatus.OK) {
			this.setUser(response.json<User>());
		}
		return response;
	}

	public async logAsUser(user: User) {
		return this.logAs(user.email, user.password);
	}
}
