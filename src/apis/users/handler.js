class UsersHandler {
	/**
	 * @param {import('../../services/postgres/users-service')} service
	 * @param {import('../../validators/users')} validator
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
	async postUserHandler(request, h) {
		this._validator.validateUserPayload(request.payload);

		const userId = await this._service.addUser(request.payload);

		const response = h.response(
			this._responseMapper.success('User added successfully', { userId })
		);
		response.code(201);

		return response;
	}
}

module.exports = UsersHandler;
