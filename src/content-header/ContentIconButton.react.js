/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import styles from './styles.css';

export type Props = {};

export default class ContentIconButton extends React.Component<Props> {
  static propTypes = {
    iconName: PropTypes.string,
  };

  render() {
    return (
      <div className={styles.contentHeaderIconContainer}>
        <i
          className={classnames(this.props.iconName, styles.contentHeaderIcon)}
        />
      </div>
    );
  }
}
