require('dotenv').config();

const hapi = require('@hapi/hapi');

async function init() {
  const server = hapi.server({
    port: process.env.PORT ?? 3000,
    host: process.env.HOST ?? 'localhost'
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => {
        return 'Hello, World!';
      }
    }
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});
