const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'collaborations',
	version: '1.0.0',
	register: async (
		server,
		{
			collaborationsService,
			usersService,
			playlistsService,
			validator,
			responseMapper,
		}
	) => {
		const handler = new CollaborationsHandler(
			collaborationsService,
			usersService,
			playlistsService,
			validator,
			responseMapper
		);

		server.route(routes(handler));
	},
};
