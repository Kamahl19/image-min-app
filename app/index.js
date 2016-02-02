import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import App from './App';

import '../node_modules/uikit/dist/css/uikit.almost-flat.min.css';
import './style.css';

render((
    <Router>
        <Route path="/" component={App} />
    </Router>
    ), document.getElementById('root')
);
