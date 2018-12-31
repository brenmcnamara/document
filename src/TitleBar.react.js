/* @flow */

import * as React from 'react';

import classnames from 'classnames';

export type Props = {};

export default class TitleBar extends React.Component<Props> {
  render() {
    return (
      <div style={styles.root}>
        <span
          contentEditable="true"
          onInput={this._onChangeTitleInput}
          placeholder="Title..."
          style={styles.titleInput}>
          {/* TODO: Need a proper placeholder */}
          {'Title...'}
        </span>
        <i className={classnames('fas', 'fa-tag')} style={styles.tagIcon} />
        <span
          contentEditable="true"
          onInput={this._onChangeTagInput}
          style={styles.tagInput}
          type="text">
          {'Add tags...'}
        </span>
      </div>
    );
  }

  _onChangeTagInput = (event: *): void => {
    console.log(event);
  };

  _onChangeTitleInput = (event: *): void => {
    console.log(event);
  };
}

const styles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  tagIcon: {
    cursor: 'pointer',
    fontSize: '10pt',
    marginRight: '8px',
  },

  tagInput: {
    border: 'none',
    outline: 'none',
    fontSize: '10pt',
  },

  titleInput: {
    outline: 'none',
    fontSize: '16pt',
    marginRight: '24px',
  },
};
