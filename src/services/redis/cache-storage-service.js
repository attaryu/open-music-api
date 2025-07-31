const redis = require('redis');

class CacheStorageService {
	constructor() {
		this._cache = redis.createClient({
			socket: { host: process.env.REDIS_SERVER },
		});

		this._cache.on('error', (error) => console.log(error));
		this._cache.connect();
	}

	/**
	 * @param {string} key 
	 * @param {string} value 
	 * 
	 * @returns {Promise<void>}
	 */
	async set(key, value) {
		await this._cache.set(key, value);
	}

	/**
	 * @param {string} key 
	 * 
	 * @returns {Promise<string|null>}
	 */
	async get(key) {
		return await this._cache.get(key);
	}

	/**
	 * @param {string} key 
	 * 
	 * @returns {Promise<void>}
	 */
	async delete(key) {
		await this._cache.del(key);
	}
}

module.exports = CacheStorageService;
