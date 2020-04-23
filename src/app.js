const hapi = require('@hapi/hapi');
const path = require('path');
const inert = require('inert');
const vision = require('@hapi/vision');

const init  = async () => {
  const server = new hapi.Server({
    port: 3000,
    host: 'localhost',
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'public')
      }
    }
  });

  await server.register(inert);
  await server.register(vision);

  server.views({
    engines: {
      html: require('ejs')
    },
    relativeTo: __dirname,
    path: 'templates',
    isCached: false
  });

  await server.start();
  console.log('Server running on: ', server.info.uri);

  server.route({
    method: 'GET',
    path: '/page',
    handler: (request, h) => {
      return h.view('index')
    }
  });
};

init();