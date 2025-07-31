const connection = require('../../databases/connection');
const NotFoundError = require('../../exceptions/not-found-error');

const generateId = require('../../utils/generate-id');

class SongsService {
	constructor() {
		this.db = connection;
	}

	/**
	 * @param {{
	 * 	title: string,
	 * 	year: number,
	 * 	performer: string,
	 * 	genre: string,
	 * 	duration: number,
	 * 	albumId: string
	 * }} songData
	 *
	 * @returns {Promise<string>}
	 */
	async createSong(songData) {
		const baseId = 'song-';

		const result = await this.db.query(
			'INSERT INTO songs (id, title, year, performer, genre, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
			// 21 based on database schema, 'id' is a VARCHAR(21)
			[
				baseId + generateId(21 - baseId.length),
				songData.title,
				songData.year,
				songData.performer,
				songData.genre,
				songData.duration ?? null,
				songData.albumId ?? null,
			]
		);

		return result.rows[0].id;
	}

	/**
	 * @param {string} title
	 * @param {string} performer
	 *
	 * @returns {Promise<Array>}
	 */
	async getSongs(title = '', performer = '') {
		const { rows } = await this.db.query(
			'SELECT id, title, performer FROM songs WHERE title ILIKE $1 and performer ILIKE $2',
			[`%${title}%`, `%${performer}%`]
		);

		return rows;
	}

	/**
	 * @param {string} songId
	 *
	 * @throws {NotFoundError}
	 * @returns {Promise<Object>}
	 */
	async getSongById(songId) {
		const result = await this.db.query('SELECT * FROM songs WHERE id = $1', [
			songId,
		]);

		if (result.rows.length === 0) {
			throw new NotFoundError('Song not found');
		}

		return result.rows[0];
	}

	/**
	 * @param {string} songId
	 * @param {{
	 * 	title: string,
	 * 	year: number,
	 * 	performer: string,
	 *  genre: string,
	 *  duration: number,
	 *  albumId: string
	 * }} songData
	 *
	 * @throws {NotFoundError}
	 * @returns {Promise<string>}
	 */
	async updateSong(songId, songData) {
		const result = await this.db.query(
			'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
			[
				songData.title,
				songData.year,
				songData.performer,
				songData.genre,
				songData.duration ?? null,
				songData.albumId ?? null,
				songId,
			]
		);

		if (result.rowCount === 0) {
			throw new NotFoundError('Song not found');
		}

		return result.rows[0].id;
	}

	/**
	 * @param {string} songId
	 *
	 * @throws {NotFoundError}
	 * @returns {Promise<void>}
	 */
	async deleteSong(songId) {
		const result = await this.db.query('DELETE FROM songs WHERE id = $1', [
			songId,
		]);

		if (result.rowCount === 0) {
			throw new NotFoundError('Song not found');
		}
	}
}

module.exports = SongsService;
