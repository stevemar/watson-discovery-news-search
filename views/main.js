import 'isomorphic-fetch';
import React from 'react';
import { Icon } from 'watson-react-components';
import TopStories from './TopStories';
import Briefing from './Briefing';
import Sentiment from './Sentiment';
import Tabs from './Tabs';

const parseData = data => {
  data.briefingItems = data.aggregations[0]
                           .aggregations[0]
                           .aggregations[0]
                           .results
                           .map(i => i.key);
  data.sentiment = data.aggregations[2]
                       .aggregations[0]
                       .results.reduce((a, i) =>
                        Object.assign(a, {[i.key]: i.matching_results})
                       , {});

  return data;
}

class Main extends React.Component {

  constructor(...props) {
    super(...props);

    this.state = {
      selectedTab: 'news',
      error: null,
      data: {},
      loading: true
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  onTabChange(selectedTab) {
    this.setState({ selectedTab });
  }

  fetchData() {
    this.setState({
      loading: true,
    });

    fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
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

    switch (this.state.selectedTab) {
      case 'news':      return <TopStories stories={data.results} />;
      case 'briefing':  return <Briefing items={data.briefingItems} />;
      case 'entities':  return <Sentiment data={data.sentiment} />;
      default:          return null;
    }
  }

  render() {
    const { selectedTab, loading } = this.state;

    return (
      <div>
        <Tabs value={selectedTab} onTabChange={this.onTabChange.bind(this)} />
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
