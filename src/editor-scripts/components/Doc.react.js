/* @flow */

import * as React from 'react';
import styles from './styles1.css';

type Props = {
  children?: React.ChildrenArray<*>,
};

export default function Document(props: Props) {
  return <section className={styles.doc}>{props.children}</section>;
}
