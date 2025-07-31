const bcrypt = require('bcrypt');

const connection = require('../../databases/connection');

const BadRequest = require('../../exceptions/bad-request-error');
const UnauthorizedError = require('../../exceptions/unauthorized-error');
const NotFoundError = require('../../exceptions/not-found-error');

const generateId = require('../../utils/generate-id');

class UsersService {
	constructor() {
		this._pool = connection;
	}

	/**
	 * @param {{username: string, password: string, fullname: string}} user
	 *
	 * @throws {BadRequest} if username already exists
	 * @returns {Promise<string>} userId
	 */
	async addUser(user) {
		const existingUser = await this._pool.query(
			'SELECT id FROM users WHERE username = $1',
			[user.username]
		);

		if (existingUser.rowCount > 0) {
			throw new BadRequest('Username already exists');
		}

		const baseId = 'user-';
		const result = await this._pool.query(
			'INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
			[
				// 22 based on database id field
				baseId + generateId(22 - baseId.length),
				user.username,
				await bcrypt.hash(user.password, 10),
				user.fullname,
			]
		);

		return result.rows[0].id;
	}

	/**
	 * @param {string} username
	 * @param {string} password
	 *
	 * @throws {UnauthorizedError}
	 * @returns {Promise<string>}
	 */
	async verifyCredentials(username, password) {
		const result = await this._pool.query(
			'SELECT id, password FROM users WHERE username = $1',
			[username]
		);

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
	 * @param {string} field
	 */
	async verifyUser(field) {
		const result = await this._pool.query(
			'SELECT id FROM users WHERE id = $1 OR username = $1',
			[field]
		);

		if (result.rowCount <= 0) {
			throw new NotFoundError('User not found');
		}
	}
}

module.exports = UsersService;
