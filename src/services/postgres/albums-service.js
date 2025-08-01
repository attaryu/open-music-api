const connection = require('../../databases/connection');

const BadRequestError = require('../../exceptions/bad-request-error');
const NotFoundError = require('../../exceptions/not-found-error');

const generateId = require('../../utils/generate-id');

class AlbumsService {
	constructor() {
		this.db = connection;
	}

	/**
	 * @param {string} name
	 * @param {number} year
	 *
	 * @returns {Promise<string>}
	 */
	async createAlbum(name, year) {
		const baseId = 'album-';

		const result = await this.db.query(
			'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
			// 22 based on database schema, 'id' is a VARCHAR(22)
			[baseId + generateId(22 - baseId.length), name, year]
		);

		return result.rows[0].id;
	}

	/**
	 * @param {string} albumId
	 *
	 * @throws {NotFoundError}
	 * @returns {Promise<Object>}
	 */
	async getAlbumById(albumId) {
		const result = await this.db.query(
			'SELECT a.id, a.name, a.year, a.cover, s.id AS "songId", s.title, s.performer FROM albums a LEFT JOIN songs s ON a.id = s.album_id WHERE a.id = $1',
			[albumId]
		);

		if (result.rows.length === 0) {
			throw new NotFoundError('Album not found');
		}

		return {
			id: result.rows[0].id,
			name: result.rows[0].name,
			year: result.rows[0].year,
			coverUrl: result.rows[0].cover,
			songs: result.rows[0].songId
				? result.rows.map((row) => ({
						id: row.songId,
						title: row.title,
						performer: row.performer,
				  }))
				: [],
		};
	}

	/**
	 * @param {string} albumId
	 * @param {string} name
	 * @param {number} year
	 *
	 * @throws {NotFoundError}
	 * @returns {Promise<string>}
	 */
	async updateAlbum(albumId, name, year) {
		const result = await this.db.query(
			'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
			[name, year, albumId]
		);

		if (result.rows.length === 0) {
			throw new NotFoundError('Album not found');
		}

		return result.rows[0].id;
	}

	/**
	 * @param {string} albumId
	 *
	 * @throws {NotFoundError}
	 * @returns {Promise<void>}
	 */
	async deleteAlbum(albumId) {
		const result = await this.db.query('DELETE FROM albums WHERE id = $1', [
			albumId,
		]);

		if (result.rowCount === 0) {
			throw new NotFoundError('Album not found');
		}
	}

	/**
	 * @param {string} albumId
	 * @param {string} coverUrl
	 *
	 * @returns {Promise<string>}
	 */
	async updateAlbumCover(albumId, coverUrl) {
		const result = await this.db.query(
			'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
			[coverUrl, albumId]
		);

		if (result.rows.length === 0) {
			throw new NotFoundError('Album not found');
		}

		return result.rows[0].id;
	}

	/**
	 * @param {string} albumId
	 * @param {string} userId
	 *
	 * @throws {BadRequestError}
	 * @returns {Promise<void>}
	 */
	async updateAlbumLikes(albumId, userId) {
		const result = await this.db.query(
			'INSERT INTO user_albums_like (album_id, user_id) VALUES ($1, $2) ON CONFLICT (album_id, user_id) DO NOTHING RETURNING album_id',
			[albumId, userId]
		);

		if (result.rowCount === 0) {
			throw new BadRequestError('Album already liked');
		}
	}

	/**
	 * @param {string} albumId
	 *
	 * @returns {Promise<number>}
	 */
	async getAlbumLikesCount(albumId) {
		const result = await this.db.query(
			'SELECT COUNT(*) FROM user_albums_like WHERE album_id = $1',
			[albumId]
		);

		if (result.rows.length === 0) {
			throw new NotFoundError('Album not found');
		}

		return parseInt(result.rows[0].count, 10);
	}

	/**
	 * @param {string} albumId 
	 * @param {string} userId 
	 * 
	 * @returns {Promise<void>}
	 */
	async deleteAlbumLike(albumId, userId) {
		await this.db.query(
			'DELETE FROM user_albums_like WHERE album_id = $1 AND user_id = $2',
			[albumId, userId]
		);
	}
}

module.exports = AlbumsService;
