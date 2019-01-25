/* @flow */

import * as React from 'react';
import styles from './styles1.css';

type Props = {
  children?: string,
};

export default function TextBlock(props: Props) {
  return <p className={styles.textBlock}>{props.children}</p>;
}
