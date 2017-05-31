const aggregations = [
  'nested(relations).term(relations.sentence)',
  'nested(entities).filter(entities.type::Company).term(entities.sentiment.type)'
];

module.exports = {
  aggregations,
  build(queryOpts) {
    const params = Object.assign({
      count: 10,
      sort: '-_score',
      passages: true,
      highlight: true,
      return: 'enrichedTitle.text,title,url,host,blekko.chrondate,score,id,entities.text,relations',
      aggregations
    }, queryOpts);

    return params;
  },
};
