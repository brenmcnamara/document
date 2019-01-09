/* @flow */

import * as React from 'react';

import styles from './styles.css';

export type Props = {};

export default class AppHeader extends React.Component<Props> {
  render() {
    return <div className={styles.header} />;
  }
}
