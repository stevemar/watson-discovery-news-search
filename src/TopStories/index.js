import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Story = props => (
  <div className="story">
      <div className="story--date">
        {moment(props.date * 1000).format('M/D/YYYY hh:MMa')}
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
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  host: PropTypes.string,
  date: PropTypes.string.isRequired
};

const TopStories = props => (
  <div>
    <div className="top-stories widget">
      <div className="widget--header">
        <h2 className="base--h2 widget--header-title">Top News</h2>
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
  stories: PropTypes.arrayOf(PropTypes.object).isRequired
};

module.exports = TopStories;
