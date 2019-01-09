/* @flow */

import * as React from 'react';
import App from './main-content/App.react';

import { BrowserRouter } from 'react-router-dom';

export type Props = {};

export default class AppContainer extends React.Component<Props> {
  render() {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
}
