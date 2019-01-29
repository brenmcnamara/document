/* @flow */

import EditorNodeUtils from '../editor-node/EditorNodeUtils';
import EditorSelectionUtils from './EditorSelectionUtils';

import type { DocumentEditorNode } from '../editor-node/EditorNodeUtils';
import type { EditorSelection } from './EditorSelectionUtils';

export type EditorContent = {|
  +doc: DocumentEditorNode,
  +sel: EditorSelection,
|};

const EditorContentUtils = {
  /**
   * Creates an empty editor content with the text at the start.
   */
  createEmptyContent(): EditorContent {
    const doc = EditorNodeUtils.createEmptyDocument();
    const sel = EditorSelectionUtils.cursorAtStart(doc);
    return { doc, sel };
  },

  /**
   * Adds a character where the cursor is, deletes all characters that are
   * selected, and moves the cursor immediately past the character that was
   * added.
   *
   * @param { EditorContent } content - The editor content
   *
   * @param { string } text - The text to add
   */
  addText(content: EditorContent, text: string): EditorContent {
    throw Error('IMPLEMENT ME');
  },
};

export default EditorContentUtils;
