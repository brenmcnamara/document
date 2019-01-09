/* @flow */

import * as React from 'react';
import Editor from '../editor/Editor.react';
import EditorContentUtils from '../editor/EditorContentUtils';

import classnames from 'classnames';

import { of } from 'rxjs';

import type { EditorAction } from '../editor/EditorActionUtils';
import type { EditorInput, EditorOutput } from '../editor/Editor.react';

export type Props = {};

export default class TitleBar extends React.Component<Props> {
  _onEditorInputReady = (input: EditorInput): EditorOutput => {
    return of(EditorContentUtils.createEmptyContent());
  };

  render() {
    return (
      <div>
        <Editor onInputReady={this._onEditorInputReady} />
      </div>
    );
  }
}
