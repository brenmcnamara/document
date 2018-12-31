/* @flow */

import * as React from 'react';
import Body from './Body.react';
import AppHeader from './AppHeader.react';

import styles from './styles.css';

import { EditorState } from 'draft-js';
import { Route, Switch, withRouter } from 'react-router-dom';

import type { ContextRouter } from 'react-router-dom';

export type Props = {};

type State = {
  +editorState: EditorState,
};

/**
 * Colors to explore:
 *
 *  - #4e51c0
 *  - #5247a9
 *  - #6d51d1
 *  - #514ed0
 *
 * Color palletes:
 *  - A:
 *    - #282c58
 *    - #f1c651
 *    - #e85e7e
 */

export default class App extends React.Component<Props, State> {
  state = {
    editorState: EditorState.createEmpty(),
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.root}>
        <AppHeader
          editorState={this.state.editorState}
          onChangeEditorState={this._onChangeEditorState}
        />
        <Body
          editorState={this.state.editorState}
          onChangeEditorState={this._onChangeEditorState}
        />
      </div>
    );
  }

  _onChangeEditorState = (editorState: EditorState): void => {
    this.setState({ editorState });
  };
}
