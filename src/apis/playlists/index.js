const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'playlists',
	version: '1.0.0',
	/**
	 * @param {import('@hapi/hapi').Server} server
	 * @param {Object} options
	 * @param {import('../../services/postgres/playlists-service')} options.playlistsService
	 * @param {import('../../services/postgres/collaborations-service')} options.collaborationsService
	 * @param {import('../../services/postgres/songs-service')} options.songsService
	 * @param {import('../../services/postgres/playlist-song-activities-service')} options.playlistSongActivitiesService
	 * @param {import('../../services/redis/cache-storage-service')} options.cacheStorageService
	 * @param {import('../../validators/playlists')} options.validator
	 * @param {import('../../utils/response-mapper')} options.responseMapper
	 */
	register: async (
		server,
		{
			playlistsService,
			collaborationsService,
			songsService,
			playlistSongActivitiesService,
			cacheStorageService,
			validator,
			responseMapper,
		}
	) => {
		const playlistsHandler = new PlaylistsHandler(
			playlistsService,
			collaborationsService,
			songsService,
			playlistSongActivitiesService,
			cacheStorageService,
			validator,
			responseMapper
		);

		server.route(routes(playlistsHandler));
	},
};
