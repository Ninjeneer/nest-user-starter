import axios, { Method } from 'axios';

interface HttpClientResponse<T> {
	execution: number;
	status: number;
	body: T;
	headers: any;
}

export default class HttpClient {
	private baseUrl: string;
	private token: string;

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

	public async delete<T>(url: string, data?: Record<string, unknown>): Promise<HttpClientResponse<T>> {
		return this.send('DELETE', url, data);
	}
}
