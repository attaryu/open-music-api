const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'authentications',
	version: '1.0.0',
	register: async (
		server,
		{
			authenticationsService,
			usersService,
			tokenManager,
			validator,
			responseMapper,
		}
	) => {
		const authenticationHandler = new AuthenticationsHandler(
			authenticationsService,
			usersService,
			tokenManager,
			validator,
			responseMapper
		);

		server.route(routes(authenticationHandler));
	},
};
