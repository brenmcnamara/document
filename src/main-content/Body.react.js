/* @flow */

import * as React from 'react';
import ContentHeader from './ContentHeader.react';
import Editor from '../editor/Editor.react';
import TitleBar from './TitleBar.react';

import styles from './styles.css';

import { of } from 'rxjs';

import type { EditorAction } from '../editor/EditorActionUtils';
import type { EditorInput, EditorOutput } from '../editor/Editor.react';

export type Props = {};

export default class Body extends React.Component<Props> {
  render() {
    return (
      <div>
        <ContentHeader />
        <div className={styles.contentContainer}>
          <TitleBar />
          <div className={styles.editorContainer} />
        </div>
      </div>
    );
  }
}
