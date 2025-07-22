const connection = require('../../databases/connection');
const NotFoundError = require('../../exceptions/not-found-error');

const generateId = require('../../utils/generate-id');

class AlbumsService {
	constructor() {
		this.db = connection;
	}

	async createAlbum(albumData) {
		try {
			const baseId = 'album-';

			const result = await this.db.query(
				'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
				// 22 based on database schema, 'id' is a VARCHAR(22)
				[
					baseId + generateId(22 - baseId.length),
					albumData.name,
					albumData.year,
				]
			);

			return result.rows[0].id;
		} catch (error) {
			console.error('Error creating album:', error);
			throw error;
		}
	}

	async getAlbumById(albumId) {
		try {
			const result = await this.db.query(
				'SELECT a.id, a.name, a.year, s.id AS "songId", s.title, s.performer FROM albums a LEFT JOIN songs s ON a.id = s.album_id WHERE a.id = $1',
				[albumId]
			);

			if (result.rows.length === 0) {
				throw new NotFoundError('Album not found');
			}

			return {
				id: result.rows[0].id,
				name: result.rows[0].name,
				year: result.rows[0].year,
				songs: result.rows[0].songId
					? result.rows.map((row) => ({
							id: row.songId,
							title: row.title,
							performer: row.performer,
					  }))
					: [],
			};
		} catch (error) {
			console.error('Error fetching album:', error);
			throw error;
		}
	}

	async updateAlbum(albumId, albumData) {
		try {
			const result = await this.db.query(
				'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
				[albumData.name, albumData.year, albumId]
			);

			if (result.rows.length === 0) {
				throw new NotFoundError('Album not found');
			}

			return result.rows[0].id;
		} catch (error) {
			console.error('Error updating album:', error);
			throw error;
		}
	}

	async deleteAlbum(albumId) {
		try {
			const result = await this.db.query('DELETE FROM albums WHERE id = $1', [
				albumId,
			]);

			if (result.rowCount === 0) {
				throw new NotFoundError('Album not found');
			}
		} catch (error) {
			console.error('Error deleting album:', error);
			throw error;
		}
	}
}

module.exports = AlbumsService;
