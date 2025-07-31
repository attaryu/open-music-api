const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'albums',
	version: '1.0.0',
	/**
	 * @param {import('@hapi/hapi').Server} server
	 * @param {Object} options
	 * @param {import('../../services/postgres/albums-service')} options.albumsService
	 * @param {import('../../services/storages/storage-service')} options.storageService
	 * @param {import('../../services/redis/cache-storage-service')} options.cacheStorageService
	 * @param {import('../../validators/albums')} options.validator
	 * @param {import('../../utils/response-mapper')} options.responseMapper
	 */
	register: async (
		server,
		{
			albumsService,
			storageService,
			cacheStorageService,
			validator,
			responseMapper,
		}
	) => {
		const albumHandler = new AlbumHandler(
			albumsService,
			storageService,
			cacheStorageService,
			validator,
			responseMapper
		);

		server.route(routes(albumHandler));
	},
};
