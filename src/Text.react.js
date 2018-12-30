/* @flow */

import * as React from 'react';

import styles from './styles.css';

export type Props = {
  children?: *,
};

export function H1(props: Props) {
  return (
    <div style={styles.header1}>{props.children}</div>
  );
}

export function H2(props: Props) {
  return (
    <div style={styles.header2}>{props.children}</div>
  );
}

export function H3(props: Props) {
  return (
    <div style={styles.header3}>{props.children}</div>
  );
}

export function P(props: Props) {
  return (
    <div style={styles.paragraph}>{props.children}</div>
  );
}
