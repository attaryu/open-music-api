const NotFoundError = require('../../exceptions/not-found-error');

class PlaylistsHandler {
	/**
	 * @param {import('../../services/postgres/playlists-service')} playlistsService
	 * @param {import('../../services/postgres/collaborations-service')} collaborationsService
	 * @param {import('../../services/postgres/songs-service')} songsService
	 * @param {import('../../services/postgres/playlist-song-activities-service')} playlistSongActivitiesService
	 * @param {import('../../services/redis/cache-storage-service')} cacheStorageService
	 * @param {import('../../validators/playlists')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(
		playlistsService,
		collaborationsService,
		songsService,
		playlistSongActivitiesService,
		cacheStorageService,
		validator,
		responseMapper
	) {
		this._playlistsService = playlistsService;
		this._collaborationsService = collaborationsService;
		this._songsService = songsService;
		this._playlistSongActivitiesService = playlistSongActivitiesService;
		this._cacheStorageService = cacheStorageService;
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
		const ownerId = request.auth.credentials.userId;
		const playlistId = await this._playlistsService.addPlaylist(name, ownerId);
		await this._cacheStorageService.delete(this._getPlaylistCacheKey(ownerId));

		return h
			.response(
				this._responseMapper.success('Playlist created successfully', {
					playlistId,
				})
			)
			.code(201);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async getPlaylistsHandler(request, h) {
		const { userId } = request.auth.credentials;

		const playlists = await this._cacheStorageService.getOrCallback(
			this._getPlaylistCacheKey(userId),
			async () => this._playlistsService.getPlaylists(userId)
		);

		const response = this._responseMapper.success(
			'Playlists retrieved successfully',
			{ playlists: playlists.data }
		);

		if (playlists.source === 'cache') {
			return h.response(response).header('X-Data-Source', 'cache');
		}

		return response;
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
		await this._playlistSongActivitiesService.addActivity(
			playlistId,
			songId,
			userId
		);
		await this._cacheStorageService.delete(
			this._getPlaylistActivitiesCacheKey(playlistId)
		);
		await this._cacheStorageService.delete(
			this._getPlaylistSongsCacheKey(playlistId, userId)
		);
		await this._cacheStorageService.delete(this._getPlaylistCacheKey(userId));

		return h
			.response(
				this._responseMapper.success('Song added to playlist successfully')
			)
			.code(201);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async getPlaylistSongsHandler(request, h) {
		const playlistId = request.params.id;
		const { userId } = request.auth.credentials;
		await this._verifyPlaylistAccess(playlistId, userId);

		const playlist = await this._cacheStorageService.getOrCallback(
			this._getPlaylistSongsCacheKey(playlistId, userId),
			async () => this._playlistsService.getPlaylistSongs(playlistId)
		);

		const response = this._responseMapper.success(
			'Songs retrieved successfully',
			{ playlist: playlist.data }
		);

		if (playlist.source === 'cache') {
			return h.response(response).header('X-Data-Source', 'cache');
		}

		return response;
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
		await this._playlistSongActivitiesService.deleteActivity(
			playlistId,
			songId,
			userId
		);
		await this._cacheStorageService.delete(
			this._getPlaylistActivitiesCacheKey(playlistId)
		);
		await this._cacheStorageService.delete(
			this._getPlaylistSongsCacheKey(playlistId, userId)
		);
		await this._cacheStorageService.delete(this._getPlaylistCacheKey(userId));

		return this._responseMapper.success(
			'Song removed from playlist successfully'
		);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deletePlaylistHandler(request) {
		const ownerId = request.auth.credentials.userId;
		const playlistId = request.params.id;
		await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

		await this._playlistsService.deletePlaylist(playlistId);
		await this._cacheStorageService.delete(
			this._getPlaylistOwnerCacheKey(playlistId, ownerId)
		);
		await this._cacheStorageService.delete(this._getPlaylistCacheKey(ownerId));

		return this._responseMapper.success('Playlist deleted successfully');
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async getPlaylistActivitiesHandler(request, h) {
		const playlistId = request.params.id;
		const { userId } = request.auth.credentials;
		await this._verifyPlaylistAccess(playlistId, userId);

		const activities = await this._cacheStorageService.getOrCallback(
			this._getPlaylistActivitiesCacheKey(playlistId),
			async () => this._playlistSongActivitiesService.getActivities(playlistId)
		);

		const response = this._responseMapper.success(
			'Activities retrieved successfully',
			activities.data
		);

		if (activities.source === 'cache') {
			return h.response(response).header('X-Data-Source', 'cache');
		}

		return response;
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
			const ownerCacheKey = this._getPlaylistOwnerCacheKey(playlistId, userId);

			await this._cacheStorageService.getOrCallback(ownerCacheKey, async () => {
				await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
				return userId;
			});
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}

			const collaboratorCacheKey = this._getPlaylistCollaboratorCacheKey(
				playlistId,
				userId
			);

			await this._cacheStorageService.getOrCallback(
				collaboratorCacheKey,
				async () => {
					await this._collaborationsService.verifyCollaboration(
						playlistId,
						userId
					);

					return userId;
				}
			);
		}
	}

	/**
	 * cache key for activities of a playlist
	 *
	 * @param {string} playlistId
	 * @returns {Promise<string>}
	 */
	_getPlaylistActivitiesCacheKey(playlistId) {
		return `playlists:${playlistId}:activities`;
	}

	/**
	 * cache key for collaborator of a playlist.
	 * always check the cache key same as the cache key in collaborations handler
	 *
	 * @param {string} playlistId
	 * @param {string} collaboratorId
	 *
	 * @returns {Promise<string>}
	 */
	_getPlaylistCollaboratorCacheKey(playlistId, collaboratorId) {
		return `playlists:${playlistId}:collaborators:${collaboratorId}`;
	}

	/**
	 * cache key for the owner of a playlist
	 * always check the cache key same as the cache key in collaborations handler
	 *
	 * @param {string} playlistId
	 * @param {string} ownerId
	 *
	 * @returns {Promise<string>}
	 */
	_getPlaylistOwnerCacheKey(playlistId, ownerId) {
		return `playlists:${playlistId}:owner:${ownerId}`;
	}

	/**
	 * cache key for playlists of a user or collaborations of a user
	 * always check the cache key same as the cache key in collaborations handler
	 *
	 * @param {string} userId
	 * @returns {string}
	 */
	_getPlaylistCacheKey(userId) {
		return `playlists:owner:${userId}`;
	}

	/**
	 * cache key for songs of a playlist
	 *
	 * @param {string} playlistId
	 * @param {string} userId
	 *
	 * @returns {string}
	 */
	_getPlaylistSongsCacheKey(playlistId, userId) {
		return `playlists:${playlistId}:songs:${userId}`;
	}
}

module.exports = PlaylistsHandler;
