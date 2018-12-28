/* @flow */

import * as React from 'react';
import App from './App.react';

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

// type FullScreenViewProps = {
//   children?: *,
// };
//
// class FullScreenView extends React.Component<FullScreenViewProps> {
//   render() {
//     const rootStyles = {
//       bottom: 0,
//       left: 0,
//       position: 'absolute',
//       right: 0,
//       top: 0,
//     };
//
//     return <div style={rootStyles}>{this.props.children}</div>;
//   }
// }
