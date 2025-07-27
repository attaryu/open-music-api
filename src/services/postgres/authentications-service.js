const { Pool } = require('pg');

const BadRequestError = require('../../exceptions/bad-request-error');

const generateId = require('../../utils/generate-id');

class AuthenticationsService {
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * @param {string} token
	 * @param {string} userId
	 *
	 * @returns {Promise<void>}
	 */
	async addAuthenticationToken(token, userId) {
		const baseId = 'auth-';

		await this._pool.query({
			text: 'INSERT INTO authentications (id, user_id, token) VALUES ($1, $2, $3)',
			values: [baseId + generateId(50 - baseId.length), userId, token],
		});
	}

	/**
	 * @param {string} token 
	 * @param {string} userId
	 * 
	 * @returns {Promise<void>}
	 */
	async verifyRefreshToken(token, userId) {
		const result = await this._pool.query({
			text: 'SELECT token FROM authentications WHERE token = $1 AND user_id = $2',
			values: [token, userId],
		});

		if (result.rowCount <= 0) {
			throw new BadRequestError('Refresh token not found');
		}
	}

	/**
	 * @param {string} token
	 * @param {string} userId
	 *
	 * @returns {Promise<void>}
	 */
	async deleteAuthenticationToken(token, userId) {
		await this._pool.query({
			text: 'DELETE FROM authentications WHERE token = $1 AND user_id = $2',
			values: [token, userId],
		});
	}
}

module.exports = AuthenticationsService;
