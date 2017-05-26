import { Header, Jumbotron, Footer } from 'watson-react-components';
import React from 'react';

class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Watson Discover News Merger and Acquisition</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="og:title" content="Watson Discovery New Search" />
          <meta name="og:description" content={this.props.description} />
          <link rel="stylesheet" type="text/css" href="/css/watson-react-components.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/application.css"/>
        </head>
        <body>
          <Header
            mainBreadcrumbs="Discover"
            mainBreadcrumbsUrl="http://www.ibm.com/watson/developercloud/discovery.html"
            subBreadcrumbs="News Search"
            subBreadcrumbsUrl=""
          />
          <Jumbotron
            serviceName="News About Merger and Aquisition of AI companies"
            repository=""
            documentation="http://www.ibm.com/watson/developercloud/doc/discovery/index.html"
            apiReference="http://www.ibm.com/watson/developercloud/discovery/api"
            startInBluemix=""
            version="GA"
            description="This is a web app to help you find News related to Merger and Acquisition in the AI Space using Watson Discovery Service."
          />
          <main>{this.props.children}</main>
          <script
            type="text/javascript"
            id="bootstrap-data"
            dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__ = ${this.props.initialData}`}}
          ></script>
          <script type="text/javascript" src="js/bundle.js" />
        </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;
