import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Icon, ButtonsGroup } from 'watson-react-components';

const getTabButtons = value => [{
  selected: value === 'briefing',
  value: 'briefing',
  id: 'rb-2',
  text: 'Briefing'
}, {
  selected: value === 'news',
  value: 'news',
  id: 'rb-1',
  text: 'Top News'
}, {
  selected: value === 'entities',
  value: 'entities',
  id: 'rb-3',
  text: 'Sentiments'
}];

export default class Search extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      searchQuery: this.props.searchQuery || '',
      selectedTab: this.props.selectedTab,
      tabButtons: getTabButtons(this.props.selectedTab)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      tabButtons: getTabButtons(props.selectedTab)
    });
  }

  tabButtonSelected(event) {
    this.props.onTabChange(event.target.value);
  }

  handleInputChange(event) {
    const value = event.target.value;
    this.setState({
      searchQuery: value
    });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' && event.target.value.match(/[^\s]+/)) {
      this.props.onSearchQueryChange({
        searchQuery: this.state.searchQuery
      });
    }
  }

  handleSearchClick() {
    if (this.state.searchQuery && this.state.searchQuery.match(/[^\s]+/)) {
      this.props.onSearchQueryChange(this.state.searchQuery);
    }
  }

  render() {
    const { showTabs } = this.props;

    return (
      <section className="_full-width-row query query_collapsed">
        <div className="_container _container_large">
          <div className="query--flex-container">
            <div className="query--text-input-container">
              <div className="query--search-container">
                <TextInput
                  placeholder="What topic are you interested in?"
                  onKeyPress={this.handleKeyPress.bind(this)}
                  onInput={this.handleInputChange.bind(this)}
                  defaultValue={this.state.searchQuery}
                />
                <div onClick={this.handleSearchClick} className="query--icon-container">
                  <Icon type="search" size="regular" fill="#ffffff" />
                </div>
              </div>
            </div>
            <div>
              {showTabs ? 
                <ButtonsGroup
                  type="radio"
                  name="radio-buttons"
                  onChange={this.tabButtonSelected.bind(this)}
                  buttons={this.state.tabButtons}
                /> : null}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Search.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
  searchQuery: PropTypes.string,
  showTabs: PropTypes.bool.isRequired
};
