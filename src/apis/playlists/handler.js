class PlaylistsHandler {
	/**
	 * @param {import('../../services/postgres/playlists-service')} service
	 * @param {import('../../validators/playlists')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(service, validator, responseMapper) {
		this._service = service;
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
    console.log('🚀 | request.auth:', request.auth);
		const { userId } = request.auth.credentials;
    
		const playlistId = await this._service.addPlaylist(name, userId);

		const response = h.response(
			this._responseMapper.success('Playlist created successfully', {
				playlistId,
			})
		);
		response.code(201);

		return response;
	}
}

module.exports = PlaylistsHandler;
