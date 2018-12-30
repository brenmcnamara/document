/* @flow */

import * as React from 'react';
import Body from './Body.react';
import Header from './Header.react';

import styles from './styles.css';

import { EditorState } from 'draft-js';
import { Route, Switch, withRouter } from 'react-router-dom';

import type { ContextRouter } from 'react-router-dom';

export type Props = {};

type State = {
  +editorState: EditorState,
};

export default class App extends React.Component<Props, State> {
  state = {
    editorState: EditorState.createEmpty(),
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.root}>
        <Header
          editorState={editorState}
          onChangeEditorState={this._onChangeEditorState}
        />
        <Body
          editorState={editorState}
          onChangeEditorState={this._onChangeEditorState}
        />
      </div>
    );
  }

  _onChangeEditorState = (editorState: EditorState): void => {
    this.setState({ editorState });
  };
}
