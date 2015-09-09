import React from 'react';

// Handle the HTML rendering on the server
export default React.createClass({
  render () {
    return (
      <html>
        <head>
          <title>{ this.props.title }</title>
          <script src="/js/bundle.js" type="text/javascript" />
        </head>
        <body dangerouslySetInnerHTML={{__html: this.props.markup}}></body>
      </html>
    );
  }
});
