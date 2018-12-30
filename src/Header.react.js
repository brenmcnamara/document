/* @flow */

import * as React from 'react';

import classnames from 'classnames';
import styles from './styles.css';

import { RichUtils } from 'draft-js';

import type { EditorState } from 'draft-js';

export type Props = {
  editorState: EditorState,
  onChangeEditorState: (editorState: EditorState) => mixed,
};

export default class Header extends React.Component<Props> {
  _onClickFolder = (): void => {};

  _onClickOutline = (): void => {};

  _onClickHeading1 = (): void => {};

  _onClickBold = (): void => {
    const editorState = RichUtils.toggleInlineStyle(
      this.props.editorState,
      'BOLD',
    );
    this.props.onChangeEditorState(editorState);
  };

  _onClickItalic = (): void => {
    const editorState = RichUtils.toggleInlineStyle(
      this.props.editorState,
      'ITALIC',
    );
    this.props.onChangeEditorState(editorState);
  };

  _onClickUnderline = (): void => {
    const editorState = RichUtils.toggleInlineStyle(
      this.props.editorState,
      'UNDERLINE',
    );
    this.props.onChangeEditorState(editorState);
  };

  render() {
    const { editorState } = this.props;
    const inlineStyle = editorState.getCurrentInlineStyle();

    return (
      <div className={styles.header}>
        <div
          className={classnames(
            styles.headerButtonGroup,
            styles.headerButtonGroup1,
          )}>
          <i
            className={classnames('far', 'fa-folder', styles.headerButton)}
            onClick={this._onClickFolder}
          />
          <i
            className={classnames('fas', 'fa-list', styles.headerButton)}
            onClick={this._onClickOutline}
          />
        </div>

        <div
          className={classnames(
            styles.headerButtonGroup,
            styles.headerButtonGroup2,
          )}>
          <i
            className={classnames('fas', 'fa-heading', styles.headerButton)}
            onClick={this._onClickHeading1}
          />
          <i
            className={classnames({
              fas: true,
              'fa-bold': true,
              [styles.headerButton]: true,
              [styles.headerButtonSelected]: inlineStyle.has('BOLD'),
            })}
            onClick={this._onClickBold}
          />
          <i
            className={classnames({
              fas: true,
              'fa-italic': true,
              [styles.headerButton]: true,
              [styles.headerButtonSelected]: inlineStyle.has('ITALIC'),
            })}
            onClick={this._onClickItalic}
          />
          <i
            className={classnames({
              fas: true,
              'fa-underline': true,
              [styles.headerButton]: true,
              [styles.headerButtonSelected]: inlineStyle.has('UNDERLINE'),
            })}
            onClick={this._onClickUnderline}
          />
        </div>

        <div
          className={classnames(
            styles.headerButtonGroup,
            styles.headerButtonGroup3,
          )}
        />
      </div>
    );
  }
}
