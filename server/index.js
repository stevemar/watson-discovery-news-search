const queryBuilder = require('./query-builder');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
  username: process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME,
  password: process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD,
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

const discovery = new DiscoveryV1({
  username: process.env.DISCOVERY_SERVICE_USERNAME,
  password: process.env.DISCOVERY_SERVICE_PASSWORD,
  version_date: DiscoveryV1.VERSION_DATE_2017_04_27,
  qs: { aggregation: `[${queryBuilder.aggregations.join(',')}]` },
});

const WatsonNewsServer = new Promise((resolve, reject) => {
  discovery.getEnvironments({}, (error, response) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      reject(error);
    } else {
      const environmentId = response.environments
                                    .find(environment => environment.read_only == true)
                                    .environment_id;

      discovery.getCollections({
        environment_id: environmentId
      }, (error, response) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          reject(error);
        } else {
          const collectionId = response.collections[0].collection_id;
          resolve(createServer(collectionId, environmentId));
        }
      });
    }
  });
});

function createServer(collectionId, environmentId) {
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
    }, function(err, response) {
      const queryOpts = {
        natural_language_query: query
      };
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);        
      } else {
        const taxonomyLabel = response.categories
                                      .filter(i => i.score > 0.5)
                                      .map(i => i.label
                                                 .split('/')
                                                 .slice(1)
                                                 .map(l => `"${l}"`).join(','))
                                      .join(',');
        queryOpts.filter = `taxonomy.label:${taxonomyLabel}`;
      }

      const params = Object.assign({}, queryBuilder.build(queryOpts), {
        environment_id: environmentId,
        collection_id: collectionId
      });

      discovery.query(params, (error, response) => {
        if (error) {
          next(error);
        } else {
          res.json(response);
        }
      });
    });
  });

  return server;
}

module.exports = WatsonNewsServer;