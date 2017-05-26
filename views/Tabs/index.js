import React from 'react';
import moment from 'moment';
import { TextInput, Icon, ButtonsGroup } from 'watson-react-components';

const getButtons = (value) => [{
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

export default class Tabs extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      value: this.props.value,
      buttons: getButtons(this.props.value)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      buttons: getButtons(props.value)
    });
  }

  buttonSelected(event) {
    this.props.onTabChange(event.target.value);
  }

  render() {
    return (
      <section className="_full-width-row query query_collapsed">
        <div className="_container _container_large">
          <div className="query--flex-container">
            <div className="query--text-input-container">
              <div className="query--search-container">
                <ButtonsGroup
                  type="radio"
                  name="radio-buttons"
                  onChange={this.buttonSelected.bind(this)}
                  buttons={this.state.buttons}
                    />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Tabs.propTypes = {
  onTabChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
};
