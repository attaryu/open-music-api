const connection = require('../../databases/connection');

const BadRequestError = require('../../exceptions/bad-request-error');

const generateId = require('../../utils/generate-id');

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
		const baseId = 'auth-';

		await this._pool.query(
			'INSERT INTO authentications (id, user_id, token) VALUES ($1, $2, $3)',
			[baseId + generateId(50 - baseId.length), userId, token]
		);
	}

	/**
	 * @param {string} token
	 * @param {string} userId
	 *
	 * @throws {BadRequestError}
	 * @returns {Promise<void>}
	 */
	async verifyRefreshToken(token, userId) {
		const result = await this._pool.query(
			'SELECT token FROM authentications WHERE token = $1 AND user_id = $2',
			[token, userId]
		);

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
		await this._pool.query(
			'DELETE FROM authentications WHERE token = $1 AND user_id = $2',
			[token, userId]
		);
	}
}

module.exports = AuthenticationsService;
