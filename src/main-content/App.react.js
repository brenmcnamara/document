import * as React from 'react';
import Body from './Body.react';
import AppHeader from './AppHeader.react';

import styles from './styles.css';

export type Props = {};

type State = {};

/**
 * Colors to explore:
 *
 *  - #4e51c0
 *  - #5247a9
 *  - #6d51d1
 *  - #514ed0
 *
 * Color palletes:
 *  - A:
 *    - #282c58
 *    - #f1c651
 *    - #e85e7e
 */

export default class App extends React.Component<Props, State> {
  state = {};

  render() {
    return (
      <div className={styles.root}>
        <AppHeader />
        <Body />
      </div>
    );
  }
}
