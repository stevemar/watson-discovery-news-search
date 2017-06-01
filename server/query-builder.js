const aggregations = [
  'nested(relations).term(relations.sentence)',
  'nested(entities).filter(entities.type::Company).term(entities.sentiment.type)'
];

module.exports = {
  aggregations,
  setEnvironmentId(environmentId) {
    this.environment_id = environmentId;
  },
  setCollectionId(collectionId) {
    this.collection_id = collectionId;
  },
  build(queryOpts) {
    const params = Object.assign({
      environment_id: this.environment_id,
      collection_id: this.collection_id,
      count: 10,
      sort: '-_score,-blekko.chrondate',
      passages: true,
      highlight: true,
      return: 'enrichedTitle.text,title,url,host,blekko.chrondate,score,id,entities.text,relations',
      aggregations
    }, queryOpts);

    return params;
  },
};
