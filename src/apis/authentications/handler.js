class AuthenticationHandler {
	/**
	 * @param {import('../../services/postgres/authentications-service')} authenticationsService
	 * @param {import('../../services/postgres/users-service')} usersService
	 * @param {import('../../providers/token-manager')} tokenManager
	 * @param {import('../../validators/authentications')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(
		authenticationsService,
		usersService,
		tokenManager,
		validator,
		responseMapper
	) {
		this._authenticationsService = authenticationsService;
		this._usersService = usersService;
		this._tokenManager = tokenManager;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 *
	 * @param {import('hapi').Request} request
	 * @param {import('hapi').ResponseToolkit} h
	 */
	async postAuthenticationHandler(request, h) {
		this._validator.validateAuthenticationPayload(request.payload);
    
		const userId = await this._usersService.verifyCredentials(
			request.payload.username,
			request.payload.password
		);

    const accessToken = this._tokenManager.generateAccessToken(userId);
    const refreshToken = this._tokenManager.generateRefreshToken(userId);

    await this._authenticationsService.addAuthenticationToken(refreshToken, userId);

    const response = h.response(this._responseMapper.success('Authentication successful', {
      accessToken,
      refreshToken,
    }));
    response.code(201);

    return response;
	}
}

module.exports = AuthenticationHandler;
