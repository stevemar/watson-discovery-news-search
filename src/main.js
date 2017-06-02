import 'isomorphic-fetch';
import React from 'react';
import { Icon } from 'watson-react-components';
import TopStories from './TopStories';
import Briefing from './Briefing';
import Sentiment from './Sentiment';
import Search from './Search';

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
    .then(response => {
      if (response.ok) {
        response.json()
          .then(json => {
            this.setState({ data: parseData(json), loading: false });
            setTimeout(() =>
              window.scrollTo(0, document.querySelector('main').getBoundingClientRect().top), 0);
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

const getTitleForItem = item => item.enrichedTitle ? item.enrichedTitle.text : (item.title || 'Untitled');

const parseData = data => {
  data.sentiment = data.aggregations[0]
                       .results.reduce((accumulator, result) =>
                        Object.assign(accumulator, { [result.key]: result.matching_results })
                       , {});

  const uniqResultsObj = data.results.reduce((result, item) =>
    Object.assign(result, { [getTitleForItem(item)]: item }), {});
  data.results = Object.keys(uniqResultsObj).map(title => uniqResultsObj[title]);

  data.briefingItems = data.results.map(item => ({
    title: getTitleForItem(item),
    text: item.text
  }));

  return data;
};

module.exports = Main;
