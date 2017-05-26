const queryBuilder = require('./query-builder');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const path = require('path');

const discovery = new DiscoveryV1({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version_date: DiscoveryV1.VERSION_DATE_2017_04_27,
  qs: { aggregation: `[${queryBuilder.aggregations.join(',')}]` },
});

const WatsonNewsServer = new Promise((resolve, reject) => {
  discovery.getEnvironments({}, (error, response) => {
    if (error) {
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
    const params = Object.assign({}, queryBuilder.build(req.body), {
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

  return server;
}

module.exports = WatsonNewsServer;