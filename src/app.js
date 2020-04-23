const hapi = require('@hapi/hapi');
const path = require('path');
const inert = require('inert');
const vision = require('@hapi/vision');

//database
require('./database')
const User = require('./models/user')

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
    isCached: process.env.NODE_ENV === 'prod'
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

  server.route({
    method:'GET',
    path:'/name',
    handler: (request, h) => {
      return h.view('namepage', {
        name: 'Alvaro'
      })
    }
  })
  server.route({
    method:'GET',
    path:'/products',
    handler: (request, h) => {
      return h.view('products', {
          products: [
            {name: 'laptop'},
            {name: 'mouse'},
            {name: 'keyword'},
            {name: 'monitor'},
          ]
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      const users = await User.find();
      console.log(users)
      return h.view('users', {
        users
      })
    }
  })

  server.route({
    method: 'POST',
    path: '/users',
    handler: (request, h) => {
      const newUser = new User({username: request.payload.username})
      console.log(newUser)
      return h.redirect().location('users')
    }
  })
};

init();