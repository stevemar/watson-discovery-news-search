import React from 'react';

const Briefing = props => (
  <div>
    <div className="top-stories widget">
      <div className="widget--header">
        <h2 className="base--h2 widget--header-title">Briefing from the Top News</h2>
        <div className="widget--header-spacer" />
      </div>
      <div className="top-stories--list">
        {props.items.map(summary => <h4>{summary}</h4>)}
      </div>
    </div>
  </div>
);

Briefing.propTypes = {
  items: React.PropTypes.string.isRequired
};

module.exports = Briefing;
