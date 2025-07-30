const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'exports',
	version: '1.0.0',
	/**
	 * @param {import('@hapi/hapi').Server} server
	 * @param {Object} options
	 * @param {import('../../services/message-queue')} options.messageQueueService
	 * @param {import('../../services/postgres/playlists-service')} options.playlistsService
	 * @param {import('../../validators/collaborations')} options.validator
	 * @param {import('../../utils/response-mapper')} options.responseMapper
	 */
	register: async (
		server,
		{ messageQueueService, playlistsService, validator, responseMapper }
	) => {
		const handler = new ExportsHandler(
			messageQueueService,
			playlistsService,
			validator,
			responseMapper
		);

		server.route(routes(handler));
	},
};
