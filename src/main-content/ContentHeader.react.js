/* @flow */

import * as React from 'react';

import cssStyles from './contentHeaderStyles.css';

import classnames from 'classnames';

export type Props = {};

export default class ContentHeader extends React.Component<Props> {
  _onClickBold = (): void => {};

  _onClickUnderline = (): void => {};

  _onClickItalic = (): void => {};

  _onClickCode = (): void => {};

  _onClickHighlight = (): void => {};

  _onClickListUnordered = (): void => {};

  _onClickListOrdered = (): void => {};

  _onClickTask = (): void => {};

  _onClickTable = (): void => {};

  _onClickImage = (): void => {};

  _onClickVideo = (): void => {};

  _onClickComment = (): void => {};

  render() {
    return (
      <div style={styles.root}>
        <div className={cssStyles.iconGroup}>
          <div className={cssStyles.iconContainer} onClick={this._onClickBold}>
            <i className={classnames('fas', 'fa-bold')} style={styles.icon} />
          </div>
          <div
            className={cssStyles.iconContainer}
            onClick={this._onClickUnderline}>
            <i
              className={classnames('fas', 'fa-underline')}
              style={styles.icon}
            />
          </div>
          <div
            className={cssStyles.iconContainer}
            onClick={this._onClickItalic}>
            <i className={classnames('fas', 'fa-italic')} style={styles.icon} />
          </div>
          <div className={cssStyles.iconContainer} onClick={this._onClickCode}>
            <i className={classnames('fas', 'fa-code')} style={styles.icon} />
          </div>
          <div
            className={cssStyles.iconContainer}
            onClick={this._onClickHighlight}>
            <i
              className={classnames('fas', 'fa-highlighter')}
              style={styles.icon}
            />
          </div>
        </div>

        <div className={cssStyles.iconGroup}>
          <div
            className={cssStyles.iconContainer}
            onClick={this._onClickListUnordered}>
            <i
              className={classnames('fas', 'fa-list-ul')}
              style={styles.icon}
            />
          </div>
          <div className={cssStyles.iconContainer}>
            <i
              className={classnames('fas', 'fa-list-ol')}
              onClick={this._onClickListOrdered}
              style={styles.icon}
            />
          </div>
          <div className={cssStyles.iconContainer} onClick={this._onClickTask}>
            <i
              className={classnames('far', 'fa-check-square')}
              style={styles.icon}
            />
          </div>
          <div className={cssStyles.iconContainer} onClick={this._onClickTable}>
            <i className={classnames('fas', 'fa-table')} />
          </div>
        </div>

        <div className={cssStyles.iconGroup}>
          <div className={cssStyles.iconContainer} onClick={this._onClickImage}>
            <i className={classnames('far', 'fa-image')} style={styles.icon} />
          </div>
          <div className={cssStyles.iconContainer} onClick={this._onClickVideo}>
            <i className={classnames('fas', 'fa-video')} style={styles.icon} />
          </div>
        </div>

        <div className={cssStyles.iconGroup}>
          <div
            className={cssStyles.iconContainer}
            onClick={this._onClickComment}>
            <i className={classnames('far', 'fa-comment')} />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  icon: {
    fontSize: '10pt',
  },

  root: {
    borderBottom: 'solid #CCC 1px',
    display: 'flex',
    flexDirection: 'row',
    margin: '8px 16px 0 16px',
    paddingBottom: '8px',
  },
};
