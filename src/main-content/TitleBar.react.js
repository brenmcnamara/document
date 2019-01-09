/* @flow */

import * as React from 'react';
import Editor from '../editor/Editor.react';

import classnames from 'classnames';
import memoize from '../memoize';

import { Observable, Subject } from 'rxjs';

import type { EditorAction, RawHTML } from '../editor/types';

export type Props = {};

export default class TitleBar extends React.Component<Props> {
  _getTitleInput = memoize(
    (): rxjs$Subject<EditorAction> => {
      return new Subject();
    },
  );

  _getTitleOutput = memoize(
    (): rxjs$Observable<RawHTML> => {
      return Observable.create(() => {});
    },
  );

  render() {
    return (
      <div style={styles.root}>
        <Editor
          inputSubject={this._getTitleInput()}
          placeholder="Title..."
          outputObservable={this._getTitleOutput()}
        />
      </div>
    );
  }
}

const styles = {};
