class AlbumHandler {
	/**
	 * @param {import('../../services/postgres/albums-service')} albumsService
	 * @param {import('../../services/storages/storage-service')} storageService
	 * @param {import('../../services/redis/cache-storage-service')} cacheStorageService
	 * @param {import('../../validators/albums')} validator
	 * @param {import('../..//utils/response-mapper')} responseMapper
	 */
	constructor(
		albumsService,
		storageService,
		cacheStorageService,
		validator,
		responseMapper
	) {
		this._albumsService = albumsService;
		this._storageService = storageService;
		this._cacheStorageService = cacheStorageService;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postAlbumHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);

		const albumId = await this._albumsService.createAlbum(
			request.payload.name,
			request.payload.year
		);

		return h
			.response(
				this._responseMapper.success('Album created successfully', { albumId })
			)
			.code(201);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async getAlbumHandler(request, h) {
		const { id } = request.params;

		const album = await this._cacheStorageService.getOrCallback(
			this._getAlbumCacheKey(id),
			() => this._albumsService.getAlbumById(id)
		);

		const response = this._responseMapper.success(
			'Album retrieved successfully',
			{ album: album.data }
		);

		if (album.source === 'cache') {
			return h.response(response).header('X-Data-Source', 'cache');
		}

		return response;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async putAlbumHandler(request) {
		this._validator.validateAlbumPayload(request.payload);
		const albumId = request.params.id;

		const updatedAlbumId = await this._albumsService.updateAlbum(
			albumId,
			request.payload.name,
			request.payload.year
		);
		await this._cacheStorageService.delete(this._getAlbumCacheKey(albumId));

		return this._responseMapper.success('Album updated successfully', {
			albumId: updatedAlbumId,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deleteAlbumHandler(request) {
		await this._albumsService.deleteAlbum(request.params.id);
		await this._cacheStorageService.delete(
			this._getAlbumCacheKey(request.params.id)
		);

		return this._responseMapper.success('Album deleted successfully');
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postAlbumCoverHandler(request, h) {
		const { cover } = request.payload;
		this._validator.validateCoverAlbumPayload(cover.hapi.headers);

		const { id } = request.params;
		const album = await this._albumsService.getAlbumById(id);

		// Check if the album exists then delete the existing cover
		if (album.coverUrl) {
			const filename = album.coverUrl.split('/').pop();
			await this._storageService.deleteFile(filename);
		}

		const coverFilename = await this._storageService.writeFile(
			cover,
			cover.hapi
		);

		await this._albumsService.updateAlbumCover(
			id,
			`http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${coverFilename}`
		);

		await this._cacheStorageService.delete(this._getAlbumCacheKey(id));

		return h
			.response(
				this._responseMapper.success('Album cover uploaded successfully')
			)
			.code(201);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postAlbumLikeHandler(request, h) {
		const { id } = request.params;
		await this._albumsService.getAlbumById(id);

		const { userId } = request.auth.credentials;
		await this._albumsService.updateAlbumLikes(id, userId);
		this._cacheStorageService.delete(this._getAlbumLikeCacheKey(id));

		return h
			.response(this._responseMapper.success('Album liked successfully'))
			.code(201);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async getAlbumLikesHandler(request, h) {
		const { id } = request.params;

		const likes = await this._cacheStorageService.getOrCallback(
			this._getAlbumLikeCacheKey(id),
			() => this._albumsService.getAlbumLikesCount(id)
		);

		const response = this._responseMapper.success(
			'Album likes count retrieved successfully',
			{ likes: likes.data }
		);

		if (likes.source === 'cache') {
			response.data.likes = parseInt(likes.data, 10);
			return h.response(response).header('X-Data-Source', 'cache');
		}

		return response;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deleteAlbumLikeHandler(request) {
		const { id } = request.params;
		const { userId } = request.auth.credentials;

		await this._albumsService.deleteAlbumLike(id, userId);
		this._cacheStorageService.delete(this._getAlbumLikeCacheKey(id));

		return this._responseMapper.success('Album unliked successfully');
	}

	/**
	 * cache key for album likes
	 * 
	 * @param {string} id
	 * @returns {string}
	 */
	_getAlbumLikeCacheKey(id) {
		return `album:${id}:likes`;
	}

	/**
	 * cache key for album
	 * 
	 * @param {string} id
	 * @returns {string}
	 */
	_getAlbumCacheKey(id) {
		return `album:${id}`;
	}
}

module.exports = AlbumHandler;
