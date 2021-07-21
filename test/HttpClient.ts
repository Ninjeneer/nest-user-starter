import axios, { Method } from 'axios';

import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import config from '../src/assets/config.json';

interface HttpClientResponse<T> {
	execution: number;
	status: number;
	body: T;
	headers: any;
}

export default class HttpClient {
	private baseUrl: string;
	private token: string;
	public user: User;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private buildHeaders() {
		return {
			authorization: this.token ? 'Bearer ' + this.token : ''
		};
	}

	public setBaseUrl(url: string): void {
		this.baseUrl = url;
	}

	public setToken(token: string): void {
		this.token = token;
	}

	public getUser(): User {
		const userCopy = JSON.parse(JSON.stringify(this.user));
		delete userCopy.password;
		delete userCopy.token;
		return userCopy;
	}

	public withoutToken(): HttpClient {
		return new HttpClient(this.baseUrl);
	}

	private async send<T>(method: Method, url: string, data?: Record<string, unknown>): Promise<HttpClientResponse<T>> {
		const t1 = Date.now();
		try {
			const response = await axios.request({
				method,
				data,
				params: method === 'GET' ? data : null,
				url: this.baseUrl + url,
				headers: this.buildHeaders()
			});
			const t2 = Date.now();
			return {
				execution: t2 - t1,
				status: response.status,
				body: response.data,
				headers: response.headers
			};
		} catch (e) {
			const t2 = Date.now();
			return {
				execution: t2 - t1,
				status: e.response.status,
				body: e.response.data,
				headers: e.response.headers
			};
		}
	}

	public async post<T>(url: string, data?: Record<string, unknown>): Promise<HttpClientResponse<T>> {
		return this.send('POST', url, data);
	}

	public async get<T>(url: string): Promise<HttpClientResponse<T>> {
		return this.send('GET', url, {});
	}

	public async put<T>(url: string, data?: Record<string, unknown>): Promise<HttpClientResponse<T>> {
		return this.send('PUT', url, data);
	}

	public async patch<T>(url: string, data?: Record<string, unknown>): Promise<HttpClientResponse<T>> {
		return this.send('PATCH', url, data);
	}

	public async delete<T>(url: string, data?: Record<string, unknown>): Promise<HttpClientResponse<T>> {
		return this.send('DELETE', url, data);
	}

	public async logAs(username?: string, password?: string): Promise<HttpClientResponse<any>> {
		const response = await this.post<any>('/auth/login', { email: username, password: password });
		if (response.status === HttpStatus.OK) {
			this.setToken(response.body.token);
		}
		return response;
	}

	public async logAsAdmin(): Promise<HttpClientResponse<any>> {
		return await this.logAs(config.tests.admin.email, config.tests.admin.password);
	}

	public async logAsBasic(): Promise<HttpClientResponse<any>> {
		return await this.logAs(config.tests.basic.email, config.tests.basic.password);
	}
}
