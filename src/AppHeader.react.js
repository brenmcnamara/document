import * as React from 'react';
import Text from './Text.react';

import classnames from 'classnames';
import styles from './styles.css';

import { RichUtils } from 'draft-js';

import type { EditorState } from 'draft-js';

export type Props = {
  editorState: EditorState,
  onChangeEditorState: (editorState: EditorState) => mixed,
};

export default class AppHeader extends React.Component<Props> {
  render() {
    return (
      <div className={styles.header}>
        <Text>{'Document'}</Text>
      </div>
    );
  }
}
