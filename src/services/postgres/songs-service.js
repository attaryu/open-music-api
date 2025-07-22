const connection = require('../../databases/connection');
const NotFoundError = require('../../exceptions/not-found-error');
const generateId = require('../../utils/generate-id');

class SongsService {
	constructor() {
		this.db = connection;
	}

	async createSong(songData) {
		try {
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
		} catch (error) {
			console.error('Error creating song:', error);
			throw error;
		}
	}

	async getSongs() {
		try {
			const result = await this.db.query(
				'SELECT id, title, performer FROM songs'
			);
			return result.rows;
		} catch (error) {
			console.error('Error fetching songs:', error);
			throw error;
		}
	}

	async getSongById(songId) {
		try {
			const result = await this.db.query('SELECT * FROM songs WHERE id = $1', [
				songId,
			]);

			if (result.rows.length === 0) {
				throw new NotFoundError('Song not found');
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error fetching song by ID:', error);
			throw error;
		}
	}

	async updateSong(songId, songData) {
		try {
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
		} catch (error) {
			console.error('Error updating song:', error);
			throw error;
		}
	}
}

module.exports = SongsService;
