/* @flow */

import * as React from 'react';
import styles from './styles1.css';

type Props = {
  children?: string,
};

export default function H3(props: Props) {
  return <h3 className={styles.header3}>{props.children}</h3>;
}
