class AuthenticationHandler {
	/**
	 * @param {import('../../services/postgres/authentications-service')} authenticationsService
	 * @param {import('../../services/postgres/users-service')} usersService
	 * @param {import('../../services/redis/cache-storage-service')} cacheStorageService
	 * @param {import('../../providers/token-manager')} tokenManager
	 * @param {import('../../validators/authentications')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(
		authenticationsService,
		usersService,
		cacheStorageService,
		tokenManager,
		validator,
		responseMapper
	) {
		this._authenticationsService = authenticationsService;
		this._usersService = usersService;
		this._cacheStorageService = cacheStorageService;
		this._tokenManager = tokenManager;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('hapi').Request} request
	 * @param {import('hapi').ResponseToolkit} h
	 */
	async postAuthenticationHandler(request, h) {
		this._validator.validatePostAuthenticationPayload(request.payload);

		const userId = await this._usersService.verifyCredentials(
			request.payload.username,
			request.payload.password
		);

		const accessToken = this._tokenManager.generateAccessToken(userId);
		const refreshToken = this._tokenManager.generateRefreshToken(userId);

		await this._authenticationsService.addAuthenticationToken(
			refreshToken,
			userId
		);
		await this._cacheStorageService.delete(
			this._getRefreshTokenCacheKey(userId)
		);

		return h
			.response(
				this._responseMapper.success('Authentication successful', {
					accessToken,
					refreshToken,
				})
			)
			.code(201);
	}

	/**
	 * @param {import('hapi').Request} request
	 */
	async putAuthenticationHandler(request) {
		this._validator.validatePutAuthenticationPayload(request.payload);
		const { refreshToken } = request.payload;

		const userId = await this._verifyRefreshToken(refreshToken);
		const accessToken = this._tokenManager.generateAccessToken(userId);

		return this._responseMapper.success('Access token refreshed', {
			accessToken,
		});
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 */
	async deleteAuthenticationHandler(request) {
		this._validator.validateDeleteAuthenticationPayload(request.payload);
		const { refreshToken } = request.payload;

		const userId = await this._verifyRefreshToken(refreshToken);
		await this._authenticationsService.deleteAuthenticationToken(
			refreshToken,
			userId
		);
		await this._cacheStorageService.delete(
			this._getRefreshTokenCacheKey(userId)
		);

		return this._responseMapper.success('Refresh token revoked');
	}

	/**
	 * @param {string} refreshToken
	 * @returns {Promise<string>}
	 */
	async _verifyRefreshToken(refreshToken) {
		const userId = this._tokenManager.verifyToken(refreshToken);
		const cacheKey = this._getRefreshTokenCacheKey(userId);

		await this._cacheStorageService.getOrCallback(cacheKey, () =>
			this._authenticationsService.getRefreshToken(refreshToken, userId)
		);

		return userId;
	}

	/**
	 * cache key for refresh token of a user
	 * 
	 * @param {string} userId
	 * @returns string
	 */
	_getRefreshTokenCacheKey(userId) {
		return `user:${userId}:refreshToken`;
	}
}

module.exports = AuthenticationHandler;
