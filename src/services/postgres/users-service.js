const { Pool } = require('pg');

const BadRequest = require('../../exceptions/bad-request-error');

const generateId = require('../../utils/generate-id');

class UsersService {
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * @param {{username: string, password: string, fullname: string}} user
	 * 
	 * @throws {BadRequest} if username already exists
	 * @returns {Promise<string>} userId
	 */
	async addUser(user) {
		await this._verifyUsername(user.username);
		
		const baseId = 'user-';
		const result = await this._pool.query({
			text: 'INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
			values: [
        // 22 based on database id field
				baseId + generateId(22 - baseId.length),
				user.username,
				user.password,
				user.fullname,
			],
		});

		return result.rows[0].id;
	}

  /**
   * @param {string} username 
	 * 
	 * @throws {BadRequest} if username already exists
	 * @returns {Promise<void>}
   */
	async _verifyUsername(username) {
		const result = await this._pool.query({
			text: 'SELECT id FROM users WHERE username = $1',
			values: [username],
		});

		if (result.rowCount > 0) {
			throw new BadRequest('Username already exists');
		}
	}
}

module.exports = UsersService;
