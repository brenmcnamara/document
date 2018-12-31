/* @flow */

import * as React from 'react';

export type Props = {
  children: string,
  size: 'NORMAL' | 'SMALL' | 'LARGE',
};

type DefaultProps = {
  size: 'NORMAL' | 'SMALL' | 'LARGE',
};

export default class Text extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    size: 'NORMAL',
  };

  render() {
    const textStyles = {
      ...styles.ALL,
      ...styles[this.props.size],
    };
    return <span style={textStyles}>{this.props.children}</span>;
  }
}

const styles = {
  ALL: {
    color: '#444',
  },

  LARGE: {
    fontSize: '14pt',
  },

  NORMAL: {
    fontSize: '10pt',
  },

  SMALL: {
    fontSize: '8pt',
  },
};
