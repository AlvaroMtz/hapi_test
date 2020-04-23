const hapi = require('@hapi/hapi');
const path = require('path');
const inert = require('inert');

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
  await server.start();
  console.log('Server running on: ', server.info.uri);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return '<h1>Hello World!</h1>'
    }
  });
  server.route({
    method: 'GET',
    path: '/about',
    handler: (request, h) => {
      return 'About'
    }
  })
  server.route({
    method: 'GET',
    path: '/hello/{user}',
    handler: (request, h) => {
      return `Hello ${request.params.user}`
    }
  })
  server.route({
    method: 'GET',
    path: '/text.txt',
    handler: (request, h) => {
      return h.file('./text.txt')
    }
  })
};

init();