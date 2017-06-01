const Promise = require('bluebird');
const queryBuilder = require('./query-builder');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
  username: process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME,
  password: process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD,
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});
nlu.analyze = Promise.promisify(nlu.analyze);

const discovery = new DiscoveryV1({
  username: process.env.DISCOVERY_SERVICE_USERNAME,
  password: process.env.DISCOVERY_SERVICE_PASSWORD,
  version_date: DiscoveryV1.VERSION_DATE_2017_04_27,
  qs: { aggregation: `[${queryBuilder.aggregations.join(',')}]` },
});
discovery.getEnvironments = Promise.promisify(discovery.getEnvironments);
discovery.getCollections = Promise.promisify(discovery.getCollections);
discovery.query = Promise.promisify(discovery.query);

module.exports = {
  nlu,
  discovery
};
