const moment = require('moment');

const aggregations = [
  'nested(relations).filter(relations.action.verb.text:acquire).term(relations.sentence)',
  'nested(entities),filter(entities.type::Company).term(entities.sentiment.type)'
];

module.exports = {
  aggregations,
  build(query, full) {
    const params = {
      count: 10,
      sort: 'date',
      return: 'enrichedTitle.text,title,url,host,blekko.chrondate,score,id,entities.text,relations',
      passages: true,
      highlight: true,
      aggregations,
      filter: `taxonomy.label:"artificial intelligence"^3,taxonomy.label:"merger and acquisition",relations.action.verb.text:acquire,blekko.chrondate>${moment().subtract(30,'d').unix()}`,
      query: ''
    };

    return params;
  },
};
