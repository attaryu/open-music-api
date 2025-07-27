const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  /**
   * @param {import('@hapi/hapi').Server} server 
   */
  register: async (server, { service, validator, responseMapper }) => {
    const usersHandler = new UsersHandler(service, validator, responseMapper);

    server.route(routes(usersHandler));
  },
}