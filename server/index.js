require('isomorphic-fetch');
const queryString = require('query-string');
const queryBuilder = require('./query-builder');
const { discovery } = require('./watson-developer-cloud');

const WatsonNewsServer = new Promise((resolve, reject) => {
  discovery.getEnvironments({})
    .then(response => {
      const environmentId = response
        .environments
        .find(env => env.read_only == true)
        .environment_id;
      queryBuilder.setEnvironmentId(environmentId);

      return discovery.getCollections({ environment_id: environmentId });
    })
    .then(response => {
      const collectionId = response.collections[0].collection_id;
      queryBuilder.setCollectionId(collectionId);
      resolve(createServer());
    })
    .catch(reject);
});

function createServer() {
  const server = require('./express');

  server.get('/', function(req, res){
    res.render('index', {});
  });

  server.get('/api/search', (req, res) => {
    const { query } = req.query;

    discovery.query(queryBuilder.build({ natural_language_query: query }))
      .then(response => res.json(response))
      .catch(error => {
        if (error.message === 'Number of free queries per month exceeded') {
          res.status(429).json(error);
        } else {
          res.status(error.code).json(error);
        }
      });
  });

  server.get('/:searchQuery', function(req, res){
    const searchQuery = req.params.searchQuery.replace(/\+/g, ' ');

    const qs = queryString.stringify({ query: searchQuery });
    fetch(`http://localhost:${process.env.PORT}/api/search?${qs}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(json => {
        res.render('index', { data: json, searchQuery, error: null });
      })
      .catch(response => {
        res.status(response.status).render('index', {
          error: (response.status === 429) ? 'Number of free queries per month exceeded' : 'Error fetching data'
        });
      });
  });

  return server;
}

module.exports = WatsonNewsServer;