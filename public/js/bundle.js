import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../../views/main';

ReactDOM.render(<Main {...window.__INITIAL_STATE__} />, document.querySelector('main'));
