import React    from 'react';
import Router   from 'react-router';

import App      from './components/App.jsx';
import Index    from './components/Index.jsx';
import Place    from './components/Place.jsx';

const Route         = Router.Route;
const DefaultRoute  = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const routes = (
  <Route name="places" path="/" handler={App}>
    <DefaultRoute name="index" handler={Index} />
    <Route name="place" path="place/:id" handler={Place} />
  </Route>
);

export default routes;
