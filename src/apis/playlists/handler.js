const NotFoundError = require('../../exceptions/not-found-error');

class PlaylistsHandler {
	/**
	 * @param {import('../../services/postgres/playlists-service')} playlistsService
	 * @param {import('../../services/postgres/collaborations-service')} collaborationsService
	 * @param {import('../../services/postgres/songs-service')} songsService
	 * @param {import('../../validators/playlists')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(
		playlistsService,
		collaborationsService,
		songsService,
		validator,
		responseMapper
	) {
		this._playlistsService = playlistsService;
		this._collaborationsService = collaborationsService;
		this._songsService = songsService;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postPlaylistHandler(request, h) {
		this._validator.validatePostPlaylistPayload(request.payload);

		const { name } = request.payload;
		const { userId } = request.auth.credentials;
		const playlistId = await this._playlistsService.addPlaylist(name, userId);

		const response = h.response(
			this._responseMapper.success('Playlist created successfully', {
				playlistId,
			})
		);
		response.code(201);

		return response;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async getPlaylistsHandler(request) {
		const { userId } = request.auth.credentials;
		const playlists = await this._playlistsService.getPlaylists(userId);

		return this._responseMapper.success('Playlists retrieved successfully', {
			playlists,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postPlaylistSongHandler(request, h) {
		this._validator.validatePostPlaylistSongPayload(request.payload);

		const { songId } = request.payload;
		await this._songsService.getSongById(songId);

		const { userId } = request.auth.credentials;
		const playlistId = request.params.id;
		await this._verifyPlaylistAccess(playlistId, userId);

		await this._playlistsService.addSongToPlaylist(playlistId, songId);

		const response = h.response(
			this._responseMapper.success('Song added to playlist successfully')
		);
		response.code(201);

		return response;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async getPlaylistSongsHandler(request) {
		const playlistId = request.params.id;
		const { userId } = request.auth.credentials;
		await this._verifyPlaylistAccess(playlistId, userId);

		const playlist = await this._playlistsService.getPlaylistSongs(playlistId);

		return this._responseMapper.success('Songs retrieved successfully', {
			playlist,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deletePlaylistSongHandler(request) {
		this._validator.validateDeletePlaylistSongPayload(request.payload);

		const { userId } = request.auth.credentials;
		const playlistId = request.params.id;
		await this._verifyPlaylistAccess(playlistId, userId);

		const { songId } = request.payload;
		await this._playlistsService.deletePlaylistSong(playlistId, songId);

		return this._responseMapper.success(
			'Song removed from playlist successfully'
		);
	}

	/**
	 * @param {impo} request
	 */
	async deletePlaylistHandler(request) {
		const { userId } = request.auth.credentials;
		const playlistId = request.params.id;
		await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

		await this._playlistsService.deletePlaylist(playlistId);

		return this._responseMapper.success('Playlist deleted successfully');
	}

	/**
	 * @param {string} playlistId 
	 * @param {string} userId 
	 * 
	 * @throws {NotFoundError} If the playlist does not exist or the user is not authorized
	 * @throws {ForbiddenError} If the user does not have access to the playlist
	 * @returns {Promise<void>}
	 */
	async _verifyPlaylistAccess(playlistId, userId) {
		try {
			await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}

			await this._collaborationsService.verifyCollaboration(playlistId, userId);
		}
	}
}

module.exports = PlaylistsHandler;
