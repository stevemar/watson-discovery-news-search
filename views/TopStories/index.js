import React from 'react';
import moment from 'moment';
import { Icon } from 'watson-react-components';

const Story = props => (
  <div className="story">
      <div className="story--date">
        {moment(props.date*1000).format("M/D/YYYY hh:MMa")}
      </div>
    <a
      className="story--title base--a results--a"
      href={props.url}
      target="_blank"
      title={props.title}
      rel="noopener noreferrer"
    >
      {props.title}
    </a>
    <div className="story--source-and-score">
      <span className="base--p story--source">
        {props.host ? props.host : 'Placeholder Source'}
      </span>
    </div>
  </div>
);

Story.propTypes = {
  title: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  host: React.PropTypes.string
};

const TopStories = props => (
  <div>
    <div className="top-stories widget">
      <div className="widget--header">
        <h2 className="base--h2 widget--header-title">Top News About Mergers and Acquisition</h2>
        <div className="widget--header-spacer" />
      </div>
      <div className="top-stories--list">
        {props.stories.map(item =>
          <Story
            key={item.id}
            title={item.enrichedTitle ? item.enrichedTitle.text : (item.title || 'Untitled')}
            url={item.url}
            host={item.host}
            date={item.blekko.chrondate}
          />)
        }
      </div>
    </div>
  </div>
);

TopStories.propTypes = {
  stories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  query: React.PropTypes.shape({
    text: React.PropTypes.string,
    date: React.PropTypes.object,
  }),
  onSortChange: React.PropTypes.func.isRequired,
};

module.exports = TopStories;
