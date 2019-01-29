/* @flow */

import * as React from 'react';
import classnames from 'classnames';
import styles from './styles1.css';

type Props = {
  children?: string,
};

export default function H1(props: Props) {
  return <h1 className={styles.header1}>{props.children}</h1>;
}
