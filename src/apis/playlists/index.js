const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'playlists',
	version: '1.0.0',
	register: async (
		server,
		{ playlistsService, songsService, validator, responseMapper }
	) => {
		const playlistsHandler = new PlaylistsHandler(
			playlistsService,
			songsService,
			validator,
			responseMapper
		);

		server.route(routes(playlistsHandler));
	},
};
