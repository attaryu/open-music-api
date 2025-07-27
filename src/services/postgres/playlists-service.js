const { Pool } = require('pg');

const NotFoundError = require('../../exceptions/not-found-error');
const ForbiddenError = require('../../exceptions/forbidden-error');

const generateId = require('../../utils/generate-id');

class PlaylistsService {
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * @param {string} name
	 * @param {string} userId
	 *
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

	/**
	 * @param {string} userId
	 *
	 * @returns {Promise<Array<{ id: string, name: string, username: string }>>}
	 */
	async getPlaylists(userId) {
		const result = await this._pool.query({
			text: 'SELECT p.id, p.name, u.username FROM playlists AS p LEFT JOIN users AS u ON p.owner = u.id WHERE p.owner = $1',
			values: [userId],
		});

		return result.rows;
	}

	/**
	 * @param {string} playlistId
	 * @param {string} songId
	 *
	 * @returns {Promise<void>}
	 */
	async addSongToPlaylist(playlistId, songId) {
		await this._pool.query({
			text: 'INSERT INTO playlist_songs (playlist_id, song_id) VALUES($1, $2)',
			values: [playlistId, songId],
		});
	}

	/**
	 * @param {string} playlistId
	 */
	async getPlaylistSongs(playlistId) {
		const result = await this._pool.query({
			text: 'SELECT p.id, p.name, u.username, s.id AS "songId", s.title, s.performer FROM songs AS s LEFT JOIN playlist_songs ON s.id = playlist_songs.song_id LEFT JOIN playlists AS p ON playlist_songs.playlist_id = p.id LEFT JOIN users AS u ON p.owner = u.id WHERE p.id = $1',
			values: [playlistId],
		});

		return {
			id: result.rows[0].id,
			name: result.rows[0].name,
			username: result.rows[0].username,
			songs: result.rows.map((row) => ({
				id: row.songId,
				title: row.title,
				performer: row.performer,
			})),
		};
	}

	/**
	 * @param {string} playlistId
	 * @param {string} userId
	 *
	 * @throws {NotFoundError} If the playlist does not exist
	 * @throws {ForbiddenError} If the user is not the owner of the playlist
	 */
	async verifyPlaylistOwner(playlistId, userId) {
		const result = await this._pool.query({
			text: 'SELECT owner FROM playlists WHERE id = $1',
			values: [playlistId],
		});

		if (result.rowCount <= 0) {
			throw new NotFoundError('Playlist not found');
		}

		if (result.rows[0].owner !== userId) {
			throw new ForbiddenError(
				'You do not have permission to access this playlist'
			);
		}
	}
}

module.exports = PlaylistsService;
