const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressBrowserify = require('express-browserify');

const app = express();

app.set('views', path.join(__dirname, '..', 'src'));
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());

// Middlewares
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/css', express.static(path.resolve(__dirname, '..', 'public/css')));
app.use(express.static(path.join(__dirname, '..', 'node_modules/watson-react-components/dist')));

const isDev = (app.get('env') === 'development');
const browserifyier = expressBrowserify(path.resolve(__dirname, '..', 'public/js/bundle.js'), {
  watch: isDev,
  debug: isDev,
  extension: ['js'],
  transform: ['babelify'],
});

if (!isDev) {
  browserifyier.browserify.transform('uglifyify', { global: true });
}

// Client Side Bundle route
app.get('/js/bundle.js', browserifyier);

// Slack Bot OAuth
app.get('/auth/redirect', (req, res) => {
  const url = `https://slack.com/api/oauth.access?code=${req.query.code}` +
    `&client_id=${process.env.SLACK_CLIENT_ID}` +
    `&client_secret=${process.env.SLACK_CLIENT_SECRET}` +
    `&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
  
  fetch(url, {
    headers: {
      'Accept': 'application/json'
    },
    method: 'GET'
  })
  .then(response => {
    if (response.ok) {
      response.json()
        .then(() => {
          res.send('Success!');
        })
        .catch(() => res.send('Error parsing json response').status(200).end());
    } else {
      console.error(response);
      res.send('Error').status(200).end();
    }
  })
  .catch(() => res.send('Error').status(200).end());
});

module.exports = app;
