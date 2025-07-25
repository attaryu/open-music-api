const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'albums',
	version: '1.0.0',
	register: async (server, { service, validator, response }) => {
		server.route(routes(new AlbumHandler(service, validator, response)));
	},
};
