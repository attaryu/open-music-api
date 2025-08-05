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
	 * @param {import('redis').SetOptions?} options
	 *
	 * @returns {Promise<void>}
	 */
	async set(key, value, options = {}) {
		await this._cache.set(key, value, { EX: options.EX ?? 3600, ...options });
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

	/**
	 * Wrapper for easy cache handling.
	 *
	 * @param {string} cacheKey
	 * @param {() => Promise<any>} originCallback Function to call and return actual data if cache miss, then store it in cache.
	 *
	 * @returns {Promise<{data: any, source: 'cache' | 'origin'}>}
	 */
	async getOrCallback(cacheKey, originCallback) {
		try {
			const data = await this.get(cacheKey);

			if (data === null) {
				throw new Error('Cache miss');
			}

			return { data: JSON.parse(data), source: 'cache' };
		} catch {
			const data = await originCallback();
			await this.set(cacheKey, JSON.stringify(data));

			return { data, source: 'origin' };
		}
	}
}

module.exports = CacheStorageService;
