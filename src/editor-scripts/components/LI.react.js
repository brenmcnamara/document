/* @flow */

import * as React from 'react';
import styles from './styles1.css';

type Props = {
  children?: React.ChildrenArray<*>,
};

export default function LI(props: Props) {
  return <li className={styles.listItem}>{props.children}</li>;
}
