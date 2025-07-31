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
	 */
	async getAlbumHandler(request) {
		const { id } = request.params;
		const album = await this._albumsService.getAlbumById(id);

		return this._responseMapper.success('Album retrieved successfully', {
			album,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async putAlbumHandler(request) {
		this._validator.validateAlbumPayload(request.payload);

		const updatedAlbumId = await this._albumsService.updateAlbum(
			request.params.id,
			request.payload.name,
			request.payload.year
		);

		return this._responseMapper.success('Album updated successfully', {
			albumId: updatedAlbumId,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deleteAlbumHandler(request) {
		await this._albumsService.deleteAlbum(request.params.id);
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
		const cacheKey = this._getAlbumLikeCacheKey(id);
		const responseMessage = 'Album likes count retrieved successfully';

		try {
			const likes = await this._cacheStorageService.get(cacheKey);

			if (likes === null) {
				throw new Error('Cache miss');
			}

			return h
				.response(
					this._responseMapper.success(responseMessage, {
						likes: parseInt(likes, 10),
					})
				)
				.header('X-Data-Source', 'cache');
		} catch {
			const likes = await this._albumsService.getAlbumLikesCount(id);
			await this._cacheStorageService.set(cacheKey, likes);

			return this._responseMapper.success(responseMessage, { likes });
		}
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
	 * @param {string} id
	 * @returns {string}
	 */
	_getAlbumLikeCacheKey(id) {
		return `album:${id}:likes`;
	}
}

module.exports = AlbumHandler;
