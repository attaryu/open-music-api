class UsersHandler {
	/**
	 * @param {import('../../services/postgres/users-service')} service
	 * @param {import('../../validators/users')} validator
	 * @param {import('../../utils/response-mapper')} responseMapper
	 */
	constructor(usersService, validator, responseMapper) {
		this._usersService = usersService;
		this._validator = validator;
		this._responseMapper = responseMapper;
	}

	/**
	 * @param {import('@hapi/hapi').Request} request
	 * @param {import('@hapi/hapi').ResponseToolkit} h
	 */
	async postUserHandler(request, h) {
		this._validator.validateUserPayload(request.payload);

		const userId = await this._usersService.addUser(request.payload);

		return h
			.response(
				this._responseMapper.success('User added successfully', { userId })
			)
			.code(201);
	}
}

module.exports = UsersHandler;
