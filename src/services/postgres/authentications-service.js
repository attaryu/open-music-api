const connection = require('../../databases/connection');

const BadRequestError = require('../../exceptions/bad-request-error');

class AuthenticationsService {
	constructor() {
		this._pool = connection;
	}

	/**
	 * @param {string} token
	 * @param {string} userId
	 *
	 * @returns {Promise<void>}
	 */
	async addAuthenticationToken(token, userId) {
		await this._pool.query(
			'INSERT INTO authentications (user_id, token) VALUES ($1, $2)',
			[userId, token]
		);
	}

	/**
	 * @param {string} token
	 * @param {string} userId
	 *
	 * @throws {BadRequestError}
	 * @returns {Promise<string>}
	 */
	async getRefreshToken(token, userId) {
		const result = await this._pool.query(
			'SELECT token FROM authentications WHERE token = $1 AND user_id = $2',
			[token, userId]
		);

		if (result.rowCount <= 0) {
			throw new BadRequestError('Refresh token not found');
		}

		return result.rows[0];
	}

	/**
	 * @param {string} token
	 * @param {string} userId
	 *
	 * @returns {Promise<void>}
	 */
	async deleteAuthenticationToken(token, userId) {
		await this._pool.query(
			'DELETE FROM authentications WHERE token = $1 AND user_id = $2',
			[token, userId]
		);
	}
}

module.exports = AuthenticationsService;
