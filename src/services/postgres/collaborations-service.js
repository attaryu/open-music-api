const { Pool } = require('pg');

const ForbiddenError = require('../../exceptions/forbidden-error');

class CollaborationsService {
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * @param {string} playlistId
	 * @param {string} userId
	 *
	 * @returns {Promise<string>}
	 */
	async addCollaboration(playlistId, userId) {
		const result = await this._pool.query({
			text: 'INSERT INTO collaborations (playlist_id, user_id) VALUES ($1, $2) RETURNING id',
			values: [playlistId, userId],
		});

		return result.rows[0].id;
	}

	/**
	 * @param {string} playlistId 
	 * @param {string} userId 
	 * 
	 * @returns {Promise<void>}
	 */
	async deleteCollaboration(playlistId, userId) {
		await this._pool.query({
			text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
			values: [playlistId, userId],
		});
	}

	/**
	 * @param {string} playlistId
	 * @param {string} userId
	 *
	 * @throws {ForbiddenError} if user does not have permission
	 * @returns {Promise<void>}
	 */
	async verifyCollaboration(playlistId, userId) {
		const result = await this._pool.query({
			text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
			values: [playlistId, userId],
		});

		if (result.rowCount <= 0) {
			throw new ForbiddenError(
				'You do not have permission to access this collaboration'
			);
		}
	}
}

module.exports = CollaborationsService;
