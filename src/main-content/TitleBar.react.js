/* @flow */

import * as React from 'react';
import Editor from '../editor/Editor.react';

import classnames from 'classnames';

import { of } from 'rxjs';

import type { EditorAction } from '../editor/EditorActionUtils';
import type { EditorInput, EditorOutput } from '../editor/Editor.react';

export type Props = {};

export default class TitleBar extends React.Component<Props> {
  render() {
    return <div />;
  }
}
