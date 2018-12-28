/* @flow */

import * as React from 'react';
import AppContainer from './AppContainer.react';
import ReactDOM from 'react-dom';

import nullthrows from 'nullthrows';

window.onload = () =>
  ReactDOM.render(<AppContainer />, nullthrows(document.getElementById('app')));
