const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const BadRequest = require('../../exceptions/bad-request-error');
const UnauthorizedError = require('../../exceptions/unauthorized-error');
const NotFoundError = require('../../exceptions/not-found-error');

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
				await bcrypt.hash(user.password, 10),
				user.fullname,
			],
		});

		return result.rows[0].id;
	}

	async verifyCredentials(username, password) {
		const result = await this._pool.query({
			text: 'SELECT id, password FROM users WHERE username = $1',
			values: [username],
		});

		if (result.rowCount <= 0) {
			throw new UnauthorizedError('Invalid credentials');
		}

		const { id, password: hashedPassword } = result.rows[0];

		if (!(await bcrypt.compare(password, hashedPassword))) {
			throw new UnauthorizedError('Invalid credentials');
		}

		return id;
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

	/**
	 * @param {string} field
	 */
	async verifyUser(field) {
		const result = await this._pool.query({
			text: 'SELECT id FROM users WHERE id = $1 OR username = $1',
			values: [field],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('User not found');
		}
	}
}

module.exports = UsersService;
