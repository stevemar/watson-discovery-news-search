import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../../src/main';

ReactDOM.render(<Main {...window.__INITIAL_STATE__} />, document.querySelector('main'));
