require('dotenv').config();

const hapi = require('@hapi/hapi');

const AlbumsService = require('./services/postgres/albums-service');

const ClientError = require('./exceptions/client-error');

const responseMapper = require('./utils/response-mapper');

async function init() {
	const server = hapi.server({
		port: process.env.PORT ?? 3000,
		host: process.env.HOST ?? 'localhost',
	});

	await server.register([
		{
			plugin: require('./apis/albums'),
			options: {
				service: new AlbumsService(),
				validator: require('./validators/albums'),
				response: responseMapper,
			}
		}
	]);

	server.ext('onPreResponse', (request, h) => {
		const { response } = request;

		if (response instanceof ClientError) {
			const newResponse = h.response(responseMapper.fail(response.message));
			newResponse.code(response.statusCode);

			return newResponse;
		}

		if (response.isServer) {
			const newResponse = h.response(responseMapper.error('Internal Server Error'));
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
