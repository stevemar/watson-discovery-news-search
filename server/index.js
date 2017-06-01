const queryBuilder = require('./query-builder');
const discovery = require('./watson-developer-cloud').discovery;
const nlu = require('./watson-developer-cloud').nlu;

const WatsonNewsServer = new Promise((resolve, reject) => {
  discovery.getEnvironments({})
    .then(response => {
      const environmentId = response.environments
                                    .find(environment => environment.read_only == true)
                                    .environment_id;
      queryBuilder.setEnvironmentId(environmentId);
      return discovery.getCollections({ environment_id: environmentId });
    })
    .then(response => {
      const collectionId = response.collections[0].collection_id;
      queryBuilder.setCollectionId(collectionId);
      resolve(createServer());
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      reject(error);
    });
});

function createServer() {
  const server = require('./express');

  server.get('/', function(req, res){
    res.render('index', {});
  });

  server.post('/api/query', (req, res, next) => {
    const query = req.body.query;

    nlu.analyze({
      text: query,
      features: {
        categories: {},
        relations: {}
      }
    })
    .then(response => {
      const taxonomyLabel = constructTaxonomyLabel({ categories: response.categories, query });
      const queryOpts = {
        natural_language_query: query,
        filter: `taxonomy.label:${taxonomyLabel}`
      };

      return discovery.query(queryBuilder.build(queryOpts));
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      
      return discovery.query(queryBuilder.build({
        natural_language_query: query
      }));
    })
    .then(response => res.json(response))
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);

      next(error);
    });
  });

  return server;
}

function constructTaxonomyLabel({ categories, query }) {
  return categories
    .reduce((result, c) => result.concat(c.label.split('/').slice(1)), [])
    .filter(c => query.indexOf(c) > -1)
    .map(c => `"${c}"`)
    .join(',');
}

module.exports = WatsonNewsServer;