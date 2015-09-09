import path from 'path';
import React from 'react';
import Router from 'react-router';
import Hapi from 'hapi';
import _merge from 'lodash.merge';
import routes from './routes.jsx';
import component from './components/Html.jsx';

const server = new Hapi.Server();

server.connection({port: 8000});

server.route({
  method: 'GET',
  path: '/hello',
  handler: function (request, reply) {
    reply('don\'t worry, be hapi!');
  }
});

server.route({
  method: 'GET',
  path: '/js/{param*}',
  handler: {
    directory: {
      path: './public/js',
      listing: true,
      index: true
    }
  }
});

server.route({
  method: 'GET',
  path: '/images/{param*}',
  handler: {
    directory: {
      path: './public/images',
      listing: true,
      index: true
    }
  }
});

server.ext('onPostHandler', (request, replay) => {
  Router.run(routes, request.url.path, (Handler, state) => {
    if (!state.routes.length) {
      return replay.continue();
    }

    let html = React.renderToStaticMarkup(component({
      title: 'test',
      markup: React.renderToString(React.createFactory(Handler)())
    }));

    return replay('<!DOCTYPE html>' + html);
  });
});

server.start(() => {
  console.log('Server running at: ' + server.info.uri);
});