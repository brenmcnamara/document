/* @flow */

import * as React from 'react';
import styles from './styles1.css';

type Props = {
  children?: React.ChildrenArray<*>,
};

export default function UL(props: Props) {
  return <ul className={styles.listUnordered}>{props.children}</ul>;
}
