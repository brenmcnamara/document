/* @flow */

import * as React from 'react';
import ContentHeader from './ContentHeader.react';
import Editor from '../editor-experimental/Editor.react';
import EditorContentUtils from '../editor-experimental/EditorContentUtils';
import TitleBar from './TitleBar.react';

import styles from './styles.css';

import { of } from 'rxjs';

import type {
  EditorInput,
  EditorOutput,
} from '../editor-experimental/Editor.react';

export type Props = {};

export default class Body extends React.Component<Props> {
  _onInputReady = (input: EditorInput): EditorOutput => {
    return of(EditorContentUtils.createEmptyContent());
  };

  render() {
    return (
      <div>
        <ContentHeader />
        <div className={styles.contentContainer}>
          <TitleBar />
          <div className={styles.editorContainer}>
            <Editor
              allowOutputToComplete={true}
              onInputReady={this._onInputReady}
            />
          </div>
        </div>
      </div>
    );
  }
}
