class ExportsHandler {
	/**
	 * @param {import('../../services/message-queue')} messageQueueService
	 * @param {import('../../services/postgres/playlists-service')} playlistsService
	 * @param {import('../../validators/exports')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(
		messageQueueService,
		playlistsService,
		validator,
		responseMapper
	) {
		this._messageQueueService = messageQueueService;
		this._playlistsService = playlistsService;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postExportPlaylistHandler(request, h) {
		this._validator.validateExportPlaylistPayload(request.payload);
		const { targetEmail } = request.payload;

		const playlistId = request.params.id;
		const { userId } = request.auth.credentials;
		await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

		await this._messageQueueService.addToQueue('export:playlist', {
			playlistId,
			targetEmail,
		});

		return h
			.response(this._responseMapper.success('Playlist export in process'))
			.code(201);
	}
}

module.exports = ExportsHandler;
