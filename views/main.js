import 'isomorphic-fetch';
import React from 'react';
import { Icon } from 'watson-react-components';
import TopStories from './TopStories';
import Briefing from './Briefing';
import Sentiment from './Sentiment';
import Search from './Search';


// const hasResults = (entities) =>
//   entities.aggregations && entities.aggregations.length > 0 &&
//   entities.aggregations[0].field === 'enrichedTitle.entities.text';

const parseData = data => {
  data.briefingItems = data.aggregations[0]
                           .aggregations[0]
                           .results
                           .map(i => i.key);
  data.sentiment = data.aggregations[1]
                       .aggregations[0]
                       .aggregations[0]
                       .results.reduce((a, i) =>
                        Object.assign(a, {[i.key]: i.matching_results})
                       , {});

  return data;
  // const parsedData = {
  //   results: data.results, // Top Results
  //   entities: {}, // Topic cloud
  //   sentiments: null, // Sentiment by source
  //   sentiment: null, // Overall sentiment
  //   mentions: null, // Mentions and Sentiments
  // };

  // data.aggregations.forEach((aggregation) => {
  //   // sentiments by source
  //   if (aggregation.type === 'term' && aggregation.field.startsWith('blekko.basedomain')) {
  //     parsedData.sentiments = aggregation;
  //   }
  //   // Overall sentiment
  //   if (aggregation.type === 'term' && aggregation.field.startsWith('docSentiment')) {
  //     parsedData.sentiment = aggregation;
  //   }

  //   if (aggregation.type === 'term' && aggregation.field === 'enrichedTitle.concepts.text') {
  //     parsedData.entities.topics = aggregation.results;
  //   }

  //   // Mentions and sentiments
  //   if (aggregation.type === 'filter' &&
  //     'aggregations' in aggregation &&
  //     aggregation.aggregations[0].field === 'enrichedTitle.entities.text') {
  //     parsedData.mentions = aggregation;
  //   }

  //   if (aggregation.type === 'nested' && aggregation.path === 'enrichedTitle.entities') {
  //     const entities = aggregation.aggregations;
  //     if (entities && entities.length > 0 && hasResults(entities[0])) {
  //       if (entities[0].match === 'enrichedTitle.entities.type:Company') {
  //         parsedData.entities.companies = entities[0].aggregations[0].results;
  //       }
  //       if (entities[0].match === 'enrichedTitle.entities.type:Person') {
  //         parsedData.entities.people = entities[0].aggregations[0].results;
  //       }
  //     }
  //   }
  // });

  // return parsedData;
};

class Main extends React.Component {

  constructor(...props) {
    super(...props);

    this.state = {
      selectedTab: 'news',
      error: null,
      data: null,
      loading: false
    };
  }

  onTabChange(selectedTab) {
    this.setState({ selectedTab });
  }

  fetchData(query) {
    this.setState({
      loading: true,
    });

    fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query.searchQuery })
    })
    .then((response) => {
      if (response.ok) {
        response.json()
          .then((json) => {
            this.setState({ data: parseData(json), loading: false });
          });
      } else {
        response.json()
        .then((error) => this.setState({ error, loading: false }))
        .catch((errorMessage) => {
          // eslint-disable-next-line no-console
          console.error(errorMessage);
          this.setState({
            error: { error: 'There was a problem with the request, please try again' },
            loading: false,
          });
        });
      }
    });
  }

  getContent() {
    const { data } = this.state;

    if (!data) {
      return null;
    }

    switch (this.state.selectedTab) {
    case 'news':      return <TopStories stories={data.results} />;
    case 'briefing':  return <Briefing items={data.briefingItems} />;
    case 'entities':  return <Sentiment data={data.sentiment} />;
    default:          return null;
    }
  }

  render() {
    const { selectedTab, loading, data } = this.state;

    return (
      <div>
        <Search
          onTabChange={this.onTabChange.bind(this)}
          onSearchQueryChange={this.fetchData.bind(this)}
          selectedTab={selectedTab}
          showTabs={!loading && Boolean(data)}
        />
        {loading ? (
          <div className="results">
            <div className="loader--container">
              <Icon type="loader" size="large" />
            </div>
          </div>
        ) : (
          <div className="results">
            <div className="_container _container_large">
              <div className="row">
                {this.getContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

module.exports = Main;
