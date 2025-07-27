class AlbumHandler {
	/**
	 * @param {import('../../services/postgres/albums-service')} albumsService
	 * @param {import('../../validators/albums')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(albumsService, validator, responseMapper) {
		this._albumsService = albumsService;
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
}

module.exports = AlbumHandler;
