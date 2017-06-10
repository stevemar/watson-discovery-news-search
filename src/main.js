import 'isomorphic-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'watson-react-components';
import queryString from 'query-string';
import TopStories from './TopStories';
import Briefing from './Briefing';
import Sentiment from './Sentiment';
import Search from './Search';
import Query from './Query';
import queryBuilder from '../server/query-builder';

class Main extends React.Component {

  constructor(...props) {
    super(...props);
    const { data, searchQuery } = this.props;

    this.state = {
      selectedTab: 'news',
      error: null,
      data: data && parseData(data),
      loading: false,
      searchQuery: searchQuery || ''
    };
  }

  onTabChange(selectedTab) {
    this.setState({ selectedTab });
  }

  fetchData(query) {
    const { searchQuery } = query;

    this.setState({
      loading: true,
      searchQuery
    });

    scrollToMain();
    history.pushState({}, {}, `/${searchQuery.replace(/ /g, '+')}`);

    const qs = queryString.stringify({ query: searchQuery });
    fetch(`/api/search?${qs}`)
    .then(response => {
      if (response.ok) {
        response.json()
          .then(json => {
            this.setState({ data: parseData(json), loading: false });
            scrollToMain();
          });
      } else {
        response.json()
        .then(error => this.setState({ error, loading: false }))
        .catch(errorMessage => {
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
    case 'sentiment': return <Sentiment data={data.sentiment} />;
    case 'query':     return <Query
                              title="Query to and Response from the Discovery Service"
                              query={queryBuilder.build({
                                natural_language_query: this.state.searchQuery
                              })}
                              response={data.rawResponse}
                            />;
    default:          return null;
    }
  }

  render() {
    const { selectedTab, loading, data, searchQuery } = this.state;

    return (
      <div>
        <Search
          onTabChange={this.onTabChange.bind(this)}
          onSearchQueryChange={this.fetchData.bind(this)}
          selectedTab={selectedTab}
          showTabs={!loading && Boolean(data)}
          searchQuery={searchQuery}
        />
        {loading ? (
          <div className="results">
            <div className="loader--container">
              <Icon type="loader" size="large" />
            </div>
          </div>
        ) : data ? (
          <div className="results">
            <div className="_container _container_large">
              <div className="row">
                {this.getContent()}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

Main.propTypes = {
  data: PropTypes.object,
  searchQuery: PropTypes.string
};

const getTitleForItem = item => item.enrichedTitle ? item.enrichedTitle.text : (item.title || 'Untitled');

const parseData = data => ({
  rawResponse: Object.assign({}, data),
  sentiment: data
    .aggregations[0]
    .results.reduce((accumulator, result) =>
      Object.assign(accumulator, { [result.key]: result.matching_results }), {}),
  results: data.results,
  briefingItems: data
    .results
    .map(item => ({
      title: getTitleForItem(item),
      text: item.text
    }))
});

function scrollToMain() {
  setTimeout(() => {
    const scrollY = document.querySelector('main').getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, scrollY);
  }, 0);
}

module.exports = Main;
