/* @flow */

import * as React from 'react';

import cssStyles from './contentHeaderStyles.css';

import classnames from 'classnames';

export type Props = {};

export default class ContentHeader extends React.Component<Props> {
  render() {
    return (
      <div style={styles.root}>
        <div className={cssStyles.iconGroup}>
          <div className={cssStyles.iconContainer}>
            <i className={classnames('fas', 'fa-bold')} style={styles.icon} />
          </div>
          <div className={cssStyles.iconContainer}>
            <i
              className={classnames('fas', 'fa-underline')}
              style={styles.icon}
            />
          </div>
          <div className={cssStyles.iconContainer}>
            <i className={classnames('fas', 'fa-italic')} style={styles.icon} />
          </div>
          <div className={cssStyles.iconContainer}>
            <i className={classnames('fas', 'fa-code')} style={styles.icon} />
          </div>
          <div className={cssStyles.iconContainer}>
            <i
              className={classnames('fas', 'fa-highlighter')}
              style={styles.icon}
            />
          </div>
        </div>

        <div className={cssStyles.iconGroup}>
          <div className={cssStyles.iconContainer}>
            <i
              className={classnames('fas', 'fa-list-ul')}
              style={styles.icon}
            />
          </div>
          <div className={cssStyles.iconContainer}>
            <i
              className={classnames('fas', 'fa-list-ol')}
              style={styles.icon}
            />
          </div>
          <div className={cssStyles.iconContainer}>
            <i
              className={classnames('far', 'fa-check-square')}
              style={styles.icon}
            />
          </div>
          <div className={cssStyles.iconContainer}>
            <i className={classnames('fas', 'fa-table')} />
          </div>
        </div>

        <div className={cssStyles.iconGroup}>
          <div className={cssStyles.iconContainer}>
            <i className={classnames('far', 'fa-image')} style={styles.icon} />
          </div>
          <div className={cssStyles.iconContainer}>
            <i className={classnames('fas', 'fa-video')} style={styles.icon} />
          </div>
        </div>

        <div className={cssStyles.iconGroup}>
          <div className={cssStyles.iconContainer}>
            <i className={classnames('far', 'fa-comment')} />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  icon: {
    cursor: 'pointer',
    fontSize: '10pt',
  },

  root: {
    borderBottom: 'solid #666 1px',
    display: 'flex',
    flexDirection: 'row',
    margin: '0 24px',
    paddingBottom: '4px',
  },
};
