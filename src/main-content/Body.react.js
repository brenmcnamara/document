/* @flow */

import * as React from 'react';
import ContentHeader from './ContentHeader.react';
import Editor from '../editor/Editor.react';
import TitleBar from './TitleBar.react';

import memoize from '../memoize';

import { Observable, Subject } from 'rxjs';

import type { EditorAction, RawHTML } from '../editor/types';

export type Props = {};

export default class Body extends React.Component<Props> {
  _onEditorReady = (inputSubject: rxjs$Subject<EditorAction>): void => {
    console.log('editor ready');
    inputSubject.subscribe(console.log);
  };

  _getEditorInput = memoize((): rxjs$Subject<EditorAction> => {
    return new Subject();
  });

  _getEditorOutput = memoize((): rxjs$Observable<RawHTML> => {
    return Observable.create(() => {});
  });

  render() {
    return (
      <div style={styles.root}>
        <ContentHeader />
        <div style={styles.contentContainer}>
          <TitleBar />
          <div style={styles.editorContainer}>
            <Editor
              inputSubject={this._getEditorInput()}
              outputObservable={this._getEditorOutput()}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  editorContainer: {
    marginTop: '40px',
  },

  contentContainer: {
    padding: '24px 40px',
  },

  root: {},
};
