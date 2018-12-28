/* @flow */

import * as React from 'react';

import styles from './styles.css';

import { Route, Switch, withRouter } from 'react-router-dom';

import type { ContextRouter } from 'react-router-dom';

export type Props = {};

export default class App extends React.Component<Props> {
  render() {
    return <div>{'Hello World'}</div>;
  }
}
