import React from 'react';
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, Legend, Tooltip } from 'recharts';

const Sentiment = props => {
  return (
    <div>
      <div className="top-stories widget">
        <div className="widget--header">
          <h2 className="base--h2 widget--header-title">Sentiment about Mergers and Aquisitions in the Market for AI Companies</h2>
          <div className="widget--header-spacer" />
        </div>
        <div className="top-stories--list">
          <BarChart width={730} height={250} data={[props.data]}>
            <XAxis dataKey="Article Count" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="negative" fill="#cd92ff" />
            <Bar dataKey="neutral" fill="#9855d4" />
            <Bar dataKey="positive" fill="#734098" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

module.exports = Sentiment;
