/* @flow */

import * as React from 'react';
import ContentHeader from './ContentHeader.react';
import TitleBar from './TitleBar.react';

import styles from './styles.css';

import { Editor, EditorState } from '../editor-draftjs/Editor.react';

export type Props = {};

type State = {
  editorState: EditorState,
};

export default class Body extends React.Component<Props, State> {
  state = {
    editorState: EditorState.createEmpty(),
  };

  _onChangeEditorState = (editorState: EditorState): void => {
    this.setState({ editorState });
  };

  render() {
    return (
      <div>
        <ContentHeader />
        <div className={styles.contentContainer}>
          <TitleBar />
          <div className={styles.editorContainer}>
            <Editor
              editorState={this.state.editorState}
              onChange={this._onChangeEditorState}
              placeholder="Type something here..."
            />
          </div>
        </div>
      </div>
    );
  }
}
