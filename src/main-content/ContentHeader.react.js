/* @flow */

import * as React from 'react';

import classnames from 'classnames';
import styles from './styles.css';

export type Props = {};

export default class ContentHeader extends React.Component<Props> {
  render() {
    return (
      <div className={styles.contentHeaderRoot}>
        <div className={styles.contentHeaderIconGroup}>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames('fas', 'fa-bold', styles.contentHeaderIcon)}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'fas',
                'fa-underline',
                styles.contentHeaderIcon,
              )}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'fas',
                'fa-italic',
                styles.contentHeaderIcon,
              )}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames('fas', 'fa-code', styles.contentHeaderIcon)}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'fas',
                'fa-highlighter',
                styles.contentHeaderIcon,
              )}
            />
          </div>
        </div>

        <div className={styles.contentHeaderIconGroup}>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'fas',
                'fa-list-ul',
                styles.contentHeaderIcon,
              )}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'fas',
                'fa-list-ol',
                styles.contentHeaderIcon,
              )}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'far',
                'fa-check-square',
                styles.contentHeaderIcon,
              )}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'fas',
                'fa-table',
                styles.contentHeaderIcon,
              )}
            />
          </div>
        </div>

        <div className={styles.contentHeaderIconGroup}>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'far',
                'fa-image',
                styles.contentHeaderIcon,
              )}
            />
          </div>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'fas',
                'fa-video',
                styles.contentHeaderIcon,
              )}
            />
          </div>
        </div>

        <div className={styles.contentHeaderIconGroup}>
          <div className={styles.contentHeaderIconContainer}>
            <i
              className={classnames(
                'far',
                'fa-comment',
                styles.contentHeaderIcon,
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
