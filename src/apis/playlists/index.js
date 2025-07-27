const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'playlists',
	version: '1.0.0',
	register: async (
		server,
		{
			playlistsService,
			collaborationsService,
			songsService,
			playlistSongActivitiesService,
			validator,
			responseMapper,
		}
	) => {
		const playlistsHandler = new PlaylistsHandler(
			playlistsService,
			collaborationsService,
			songsService,
			playlistSongActivitiesService,
			validator,
			responseMapper
		);

		server.route(routes(playlistsHandler));
	},
};
