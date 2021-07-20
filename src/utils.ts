import config from './assets/config.json';

export default class Utils {
	public static buildServerURL(): string {
		return `${config.server.protocol}://${config.server.host}:${config.server.port}`;
	}
}
