import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, Legend } from 'recharts';
import { Colors } from 'watson-react-components';

const Sentiment = props => {
  return (
    <div>
      <div className="top-stories widget">
        <div className="widget--header">
          <h2 className="base--h2 widget--header-title">Sentiment expressed in the news</h2>
          <div className="widget--header-spacer" />
        </div>
        <div className="top-stories--list">
          <BarChart width={730} height={250} data={[props.data]}>
            <XAxis dataKey="Article Count" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend />
            <Bar dataKey="negative" fill={Colors.red_10} />
            <Bar dataKey="neutral" fill={Colors.gray_10} />
            <Bar dataKey="positive" fill={Colors.green_10} />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

Sentiment.propTypes = {
  data: PropTypes.object.isRequired
};

module.exports = Sentiment;
