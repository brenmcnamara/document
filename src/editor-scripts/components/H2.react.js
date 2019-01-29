/* @flow */

import * as React from 'react';
import styles from './styles1.css';

type Props = {
  children?: string,
};

export default function H2(props: Props) {
  return <h2 className={styles.header2}>{props.children}</h2>;
}
