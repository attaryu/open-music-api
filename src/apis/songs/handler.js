class SongsHandler {
	/**
	 * @param {import('../../services/postgres/songs-service')} songsService
	 * @param {import('../../validators/songs')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(songsService, validator, responseMapper) {
		this._songsService = songsService;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postSongHandler(request, h) {
		this._validator.validateSongPayload(request.payload);
		const songId = await this._songsService.createSong(request.payload);

		return h
			.response(
				this._responseMapper.success('Song created successfully', { songId })
			)
			.code(201);
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async getSongsHandler(request) {
		this._validator.validateSongQueryParameters(request.query);

		const songs = await this._songsService.getSongs(
			request.query.title,
			request.query.performer
		);

		return this._responseMapper.success('Songs retrieved successfully', {
			songs,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async getSongHandler(request) {
		const { id } = request.params;
		const song = await this._songsService.getSongById(id);

		return this._responseMapper.success('Song retrieved successfully', {
			song,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async putSongHandler(request) {
		this._validator.validateSongPayload(request.payload);

		const { id } = request.params;
		const songId = await this._songsService.updateSong(id, request.payload);

		return this._responseMapper.success('Song updated successfully', {
			songId,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deleteSongHandler(request) {
		const { id } = request.params;
		await this._songsService.deleteSong(id);

		return this._responseMapper.success('Song deleted successfully');
	}
}

module.exports = SongsHandler;
