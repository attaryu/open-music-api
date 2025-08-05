const BadRequestError = require('../../exceptions/bad-request-error');

class CollaborationsHandler {
	/**
	 * @param {import('../../services/postgres/collaborations-service')} collaborationsService
	 * @param {import('../../services/postgres/users-service')} usersService
	 * @param {import('../../services/postgres/playlists-service')} playlistsService
	 * @param {import('../../services/redis/cache-storage-service')} cacheStorageService
	 * @param {import('../../validators/collaborations')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(
		collaborationsService,
		usersService,
		playlistsService,
		cacheStorageService,
		validator,
		responseMapper
	) {
		this._collaborationsService = collaborationsService;
		this._usersService = usersService;
		this._playlistsService = playlistsService;
		this._cacheStorageService = cacheStorageService;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postCollaborationHandler(request, h) {
		this._validator.validatePostCollaborationPayload(request.payload);
		const { playlistId, userId: collaboratorId } = request.payload;
		await this._usersService.verifyUser(collaboratorId);

		const ownerId = request.auth.credentials.userId;
		const ownerCacheKey = this._getPlaylistOwnerCacheKey(playlistId, ownerId);
		await this._cacheStorageService.getOrCallback(ownerCacheKey, async () => {
			await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
			return ownerId;
		});

		/**
		 * reverse logic to check if the user is already a collaborator.
		 * if the user is already a collaborator, we throw a BadRequestError.
		 * This is to prevent adding the same user as a collaborator multiple times.
		 */
		try {
			await this._collaborationsService.verifyCollaboration(
				playlistId,
				collaboratorId
			);

			throw new BadRequestError('User already has been added as collaborator');
		} catch (error) {
			if (error instanceof BadRequestError) {
				throw error;
			}

			/**
			 * If the error is not a BadRequestError, it means the collaboration does not exist
			 * so we can proceed to add it.
			 */
		}

		const collaborationId = await this._collaborationsService.addCollaboration(
			playlistId,
			collaboratorId
		);

		await this._cacheStorageService.delete(
			this._getPlaylistCollaboratorCacheKey(playlistId, collaboratorId)
		);

		await this._cacheStorageService.delete(
			this._getPlaylistCacheKey(collaboratorId)
		);

		return h
			.response(
				this._responseMapper.success('Collaboration added successfully', {
					collaborationId,
				})
			)
			.code(201);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deleteCollaborationHandler(request) {
		this._validator.validateDeleteCollaborationPayload(request.payload);
		const { playlistId, userId: collaboratorId } = request.payload;

		const ownerId = request.auth.credentials.userId;
		const ownerCacheKey = this._getPlaylistOwnerCacheKey(playlistId, ownerId);
		await this._cacheStorageService.getOrCallback(ownerCacheKey, async () => {
			await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
			return ownerId;
		});

		await this._collaborationsService.deleteCollaboration(
			playlistId,
			collaboratorId
		);

		await this._cacheStorageService.delete(
			this._getPlaylistCollaboratorCacheKey(playlistId, collaboratorId)
		);

		await this._cacheStorageService.delete(
			this._getPlaylistCacheKey(collaboratorId)
		);

		return this._responseMapper.success('Collaboration deleted successfully');
	}

	/**
	 * cache key for collaborator of a playlist.
	 * always check the cache key same as the cache key in playlists handler
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
	 * always check the cache key same as the cache key in playlists handler
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
	 * cache key for playlists of a user.
	 * always check the cache key same as the cache key in playlists handler.
	 *
	 * @param {string} userId
	 * @returns {string}
	 */
	_getPlaylistCacheKey(userId) {
		return `playlists:owner:${userId}`;
	}
}

module.exports = CollaborationsHandler;
