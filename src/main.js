require('dotenv').config();

const hapi = require('@hapi/hapi');
const path = require('node:path');

const ClientError = require('./exceptions/client-error');

const responseMapper = require('./utils/response-mapper');

async function init() {
	const server = hapi.server({
		port: process.env.PORT ?? 3000,
		host: process.env.HOST ?? 'localhost',
	});

	await server.register([
		{ plugin: require('@hapi/jwt') },
		{ plugin: require('@hapi/inert') },
	]);

	server.auth.strategy('openmusic_jwt', 'jwt', {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_EXPIRATION,
		},
		validate: (artifacts) => ({
			isValid: true,
			credentials: {
				userId: artifacts.decoded.payload.userId,
			},
		}),
	});

	const usersService = new (require('./services/postgres/users-service'))();
	const songsService = new (require('./services/postgres/songs-service'))();
	const collaborationsService =
		new (require('./services/postgres/collaborations-service'))();
	const playlistsService =
		new (require('./services/postgres/playlists-service'))();
	const cacheStorageService =
		new (require('./services/redis/cache-storage-service'))();

	await server.register([
		{
			plugin: require('./apis/albums'),
			options: {
				albumsService: new (require('./services/postgres/albums-service'))(),
				storageService: new (require('./services/storages/storage-service'))(
					path.resolve('public', 'covers')
				),
				cacheStorageService,
				validator: require('./validators/albums'),
				responseMapper,
			},
		},
		{
			plugin: require('./apis/songs'),
			options: {
				songsService,
				validator: require('./validators/songs'),
				responseMapper,
			},
		},
		{
			plugin: require('./apis/users'),
			options: {
				usersService,
				validator: require('./validators/users'),
				responseMapper,
			},
		},
		{
			plugin: require('./apis/authentications'),
			options: {
				authenticationsService:
					new (require('./services/postgres/authentications-service'))(),
				usersService,
				cacheStorageService,
				tokenManager: new (require('./providers/token-manager'))(),
				validator: require('./validators/authentications'),
				responseMapper,
			},
		},
		{
			plugin: require('./apis/playlists'),
			options: {
				playlistsService,
				collaborationsService,
				songsService,
				playlistSongActivitiesService:
					new (require('./services/postgres/playlist-song-activities-service'))(),
				cacheStorageService,
				validator: require('./validators/playlists'),
				responseMapper,
			},
		},
		{
			plugin: require('./apis/collaborations'),
			options: {
				collaborationsService,
				usersService,
				playlistsService,
				cacheStorageService,
				validator: require('./validators/collaborations'),
				responseMapper,
			},
		},
		{
			plugin: require('./apis/exports'),
			options: {
				messageQueueService: require('./services/message-queue'),
				playlistsService,
				validator: require('./validators/exports'),
				responseMapper,
			},
		},
	]);

	server.ext('onPreResponse', (request, h) => {
		const { response } = request;

		if (
			response instanceof Error &&
			process.env.NODE_ENV.trim() === 'development'
		) {
			console.error(response);
		}

		if (response instanceof ClientError) {
			const newResponse = h.response(responseMapper.fail(response.message));
			newResponse.code(response.statusCode);

			return newResponse;
		}

		if (response.isServer) {
			const newResponse = h.response(
				responseMapper.error('Internal Server Error')
			);
			newResponse.code(500);

			return newResponse;
		}

		return h.continue;
	});

	await server.start();

	console.log(`Server running on ${server.info.uri}`);
}

init().catch((err) => {
	console.error(err);
	process.exit(1);
});
