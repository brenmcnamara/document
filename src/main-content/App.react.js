import * as React from 'react';
import Body from './Body.react';
import AppHeader from './AppHeader.react';

import styles from './styles.css';

export type Props = {};

export default class App extends React.Component<Props> {
  render() {
    return (
      <div className={styles.root}>
        <AppHeader />
        <Body />
      </div>
    );
  }
}
