import * as React from 'react';

import styles from './styles.css';

import { Editor, RichUtils } from 'draft-js';

import type { EditorState } from 'draft-js';

export type Props = {
  editorState: EditorState,
  onChangeEditorState: (editorState: EditorState) => mixed,
};

export default class Body extends React.Component<Props> {
  _editorRef: * = React.createRef();

  componentDidMount(): void {
    this._editorRef.current.focus();
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.editorState !== nextProps.editorState) {
      this._editorRef.current.focus();
    }
  }

  render() {
    return (
      <div className={styles.editorContainer}>
        <Editor
          editorState={this.props.editorState}
          handleKeyCommand={this._handleKeyCommand}
          onChange={this._onChangeEditor}
          ref={this._editorRef}
        />
      </div>
    );
  }

  _onChangeEditor = (editorState: EditorState): void => {
    this.props.onChangeEditorState(editorState);
  };

  _handleKeyCommand = (command: string): void => {
    let { editorState } = this.props;

    switch (command) {
      case 'bold': {
        editorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        this.props.onChangeEditorState(editorState);
        return 'handled';
      }

      case 'italic': {
        editorState = RichUtils.toggleInlineStyle(editorState, 'ITALIC');
        this.props.onChangeEditorState(editorState);
        return 'handled';
      }

      case 'underline': {
        editorState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
        this.props.onChangeEditorState(editorState);
        return 'handled';
      }
    }

    return 'not-handled';
  };
}
