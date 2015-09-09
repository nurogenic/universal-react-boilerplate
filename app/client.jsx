import React  from 'react';
import Router from 'react-router';
import routes from './routes.jsx';

document.addEventListener("DOMContentLoaded", (event) => {
  Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    React.render(<Handler />, document.body);
  });
});
