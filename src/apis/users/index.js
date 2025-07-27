const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'users',
	version: '1.0.0',
	/**
	 * @param {import('@hapi/hapi').Server} server
	 * @param {Object} options
	 * @param {import('../../services/postgres/users-service')} options.usersService
	 * @param {import('../../validators/users')} options.validator
	 * @param {import('../../utils/response-mapper')} options.responseMapper
	 */
	register: async (server, { usersService, validator, responseMapper }) => {
		const usersHandler = new UsersHandler(
			usersService,
			validator,
			responseMapper
		);

		server.route(routes(usersHandler));
	},
};
