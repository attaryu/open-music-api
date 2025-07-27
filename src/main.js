require('dotenv').config();

const hapi = require('@hapi/hapi');

const ClientError = require('./exceptions/client-error');

const responseMapper = require('./utils/response-mapper');

async function init() {
	const server = hapi.server({
		port: process.env.PORT ?? 3000,
		host: process.env.HOST ?? 'localhost',
	});

	await server.register({
		plugin: require('@hapi/jwt'),
	});

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

	await server.register([
		{
			plugin: require('./apis/albums'),
			options: {
				service: new (require('./services/postgres/albums-service'))(),
				validator: require('./validators/albums'),
				response: responseMapper,
			},
		},
		{
			plugin: require('./apis/songs'),
			options: {
				service: songsService,
				validator: require('./validators/songs'),
				response: responseMapper,
			},
		},
		{
			plugin: require('./apis/users'),
			options: {
				service: usersService,
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
				validator: require('./validators/collaborations'),
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
