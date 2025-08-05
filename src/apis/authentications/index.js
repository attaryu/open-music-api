const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'authentications',
	version: '1.0.0',
	/**
	 * @param {import('@hapi/hapi').Server} server
	 * @param {Object} options
	 * @param {import('../../services/postgres/authentications-service')} options.authenticationsService
	 * @param {import('../../services/postgres/users-service')} options.usersService
	 * @param {import('../../services/redis/cache-storage-service')} options.cacheStorageService
	 * @param {import('../../providers/token-manager')} options.tokenManager
	 * @param {import('../../validators/authentications')} options.validator
	 * @param {import('../../utils/response-mapper')} options.responseMapper
	 */
	register: async (
		server,
		{
			authenticationsService,
			usersService,
			cacheStorageService,
			tokenManager,
			validator,
			responseMapper,
		}
	) => {
		const authenticationHandler = new AuthenticationsHandler(
			authenticationsService,
			usersService,
			cacheStorageService,
			tokenManager,
			validator,
			responseMapper
		);

		server.route(routes(authenticationHandler));
	},
};
