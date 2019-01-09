/* @flow */

import EditorSelectionUtils from './EditorSelectionUtils';

import type { EditorSelection } from './EditorSelectionUtils';

export type EditorContent = {|
  +html: HTMLElement,
  +selection: EditorSelection,
|};

export default {
  /**
   * Create an empty content object.
   */
  createEmptyContent(): EditorContent {
    const html = document.createElement('span');
    const selection = EditorSelectionUtils.cursorAtStart(html);
    return { html, selection };
  },
};
