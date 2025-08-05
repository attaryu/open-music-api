const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'collaborations',
	version: '1.0.0',
	/**
	 * @param {import('@hapi/hapi').Server} server
	 * @param {Object} options
	 * @param {import('../../services/postgres/collaborations-service')} options.collaborationsService
	 * @param {import('../../services/postgres/users-service')} options.usersService
	 * @param {import('../../services/postgres/playlists-service')} options.playlistsService
	 * @param {import('../../services/redis/cache-storage-service')} options.cacheStorageService
	 * @param {import('../../validators/collaborations')} options.validator
	 * @param {import('../../utils/response-mapper')} options.responseMapper
	 */
	register: async (
		server,
		{
			collaborationsService,
			usersService,
			playlistsService,
			cacheStorageService,
			validator,
			responseMapper,
		}
	) => {
		const handler = new CollaborationsHandler(
			collaborationsService,
			usersService,
			playlistsService,
			cacheStorageService,
			validator,
			responseMapper
		);

		server.route(routes(handler));
	},
};
