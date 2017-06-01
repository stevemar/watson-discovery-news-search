const aggregations = [
  'term(docSentiment.type)'
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
      sort: '-_score',
      passages: true,
      highlight: true,
      filter: 'blekko.hostrank>200',
      return: 'enrichedTitle.text,text,title,url,host,blekko.chrondate,blekko.hostrank,score,id,entities.text,docSentiment.type',
      aggregations
    }, queryOpts);

    return params;
  },
};
