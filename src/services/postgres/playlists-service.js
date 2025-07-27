const { Pool } = require('pg');

const generateId = require('../../utils/generate-id');

class PlaylistsService {
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * @param {string} name
	 * @param {string} userId
	 * @returns {Promise<string>}
	 */
	async addPlaylist(name, userId) {
		const baseId = 'playlist-';

		const result = await this._pool.query({
			text: 'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3) RETURNING id',
			values: [baseId + generateId(25 - baseId.length), name, userId],
		});

		return result.rows[0].id;
	}
}

module.exports = PlaylistsService;
