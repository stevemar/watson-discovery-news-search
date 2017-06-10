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

  server.get('/api/search', (req, res, next) => {
    const { query } = req.query;

    discovery.query(queryBuilder.build({ natural_language_query: query }))
      .then(response => res.json(response))
      .catch(next);
  });

  server.get('/:searchQuery', function(req, res, next){
    const searchQuery = req.params.searchQuery.replace(/\+/g, ' ');

    const qs = queryString.stringify({ query: searchQuery });
    fetch(`http://localhost:${process.env.PORT}/api/search?${qs}`)
    .then(response => {
      if (response.ok) {
        response.json()
          .then(json => {
            res.render('index', { data: json, searchQuery });
          })
          .catch(next);
      } else {
        response.json()
          .then(next)
          .catch(next);
      }
    });
  });

  return server;
}

module.exports = WatsonNewsServer;