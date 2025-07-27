class CollaborationsHandler {
	/**
	 * @param {import('../../services/postgres/collaborations-service')} collaborationsService
	 * @param {import('../../services/postgres/users-service')} usersService
	 * @param {import('../../services/postgres/playlists-service')} playlistsService
	 * @param {import('../../validators/collaborations')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(
		collaborationsService,
		usersService,
		playlistsService,
		validator,
		responseMapper
	) {
		this._collaborationsService = collaborationsService;
		this._usersService = usersService;
		this._playlistsService = playlistsService;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postCollaborationHandler(request, h) {
		this._validator.validatePostCollaborationPayload(request.payload);
		
		const { playlistId, userId } = request.payload;
		await this._usersService.verifyUser(userId);

		const ownerId = request.auth.credentials.userId;
		await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

		const collaborationId = await this._collaborationsService.addCollaboration(
			playlistId,
			userId
		);

		return h
			.response(
				this._responseMapper.success('Collaboration added successfully', {
					collaborationId,
				})
			)
			.code(201);
	}
}

module.exports = CollaborationsHandler;
