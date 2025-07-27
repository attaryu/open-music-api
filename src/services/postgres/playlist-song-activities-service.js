const { Pool } = require('pg');

class PlaylistSongActivitiesService {
	constructor() {
		this._pool = new Pool();
	}

	async _insertActivity(playlistId, songId, userId, action) {
		const result = await this._pool.query({
			text: 'INSERT INTO playlist_song_activities (playlist_id, song_id, user_id, action) VALUES ($1, $2, $3, $4) RETURNING id',
			values: [playlistId, songId, userId, action],
		});

		return result.rows[0].id;
	}

	async addActivity(playlistId, songId, userId) {
		return await this._insertActivity(playlistId, songId, userId, 'add');
	}

	async deleteActivity(playlistId, songId, userId) {
		return await this._insertActivity(playlistId, songId, userId, 'delete');
	}

	async getActivities(playlistId) {
		const result = await this._pool.query({
			text: 'SELECT p.id AS "playlistId", u.username, s.title, psa.action, psa.time FROM playlist_song_activities AS psa LEFT JOIN playlists AS p ON psa.playlist_id = p.id LEFT JOIN songs AS s ON psa.song_id = s.id LEFT JOIN users AS u ON psa.user_id = u.id WHERE psa.playlist_id = $1 ORDER BY psa.time ASC',
			values: [playlistId],
		});

		return {
			playlistId: result.rows[0].playlistId,
			activities: result.rows.map((row) => ({
				username: row.username,
				title: row.title,
				action: row.action,
				time: row.time,
			})),
		};
	}
}

module.exports = PlaylistSongActivitiesService;
