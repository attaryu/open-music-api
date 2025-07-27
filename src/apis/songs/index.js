const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'songs',
	version: '1.0.0',
	/**
	 * @param {import('@hapi/hapi').Server} server
	 * @param {Object} options
	 * @param {import('../../services/postgres/songs-service')} options.songsService
	 * @param {import('../../validators/songs')} options.validator
	 * @param {import('../../utils/response-mapper')} options.responseMapper
	 */
	register: async (server, { songsService, validator, responseMapper }) => {
		const songsHandler = new SongsHandler(songsService, validator, responseMapper);

		server.route(routes(songsHandler));
	},
};
