/* @flow */

import DOMUtils from './DOMUtils';
import EditorSelectionUtils from './EditorSelectionUtils';

import invariant from 'invariant';

import type { EditorSelection } from './EditorSelectionUtils';

export type EditorContent = {|
  +html: HTMLElement,
  +selection: EditorSelection,
|};

const EditorContentUtils = {
  /**
   * Adds the specified string where the cursor is in the editor. The string
   * will be added where the selection currently exists. If the selection is
   * over a range of text, that text will be removed.
   *
   * @param { EditorContent } content - The content to create from.
   *
   * @param { string } str - The string to add.
   *
   * @param { boolean } [moveCursorToEnd] - If true, this will move the
   *        selection cursor to the end of the string. Otherwise, it will leave
   *        the cursor where it was.
   */
  addString(
    content: EditorContent,
    str: string,
    moveCursorToEnd: boolean = true,
  ): EditorContent {
    const { html, selection } = content;
    const normalizeSel = EditorSelectionUtils.normalize(selection);
    invariant(
      EditorSelectionUtils.isCollapsed(normalizeSel),
      'For now, only collapsed selection',
    );
    const { anchorNode: node, anchorOffset: offset } = normalizeSel;
    const textContent =
      node.textContent.slice(0, offset) + str + node.textContent.slice(offset);

    // Need to create a copy of the html tree. Before doing so, need to make
    // sure that we can get a reference to the anchor / focus of the new html
    // tree. Use indexPath to do this.
    const indexPath = DOMUtils.indexPathToNode(html, selection.anchorNode);
    const newHTML = html.cloneNode(true);
    const newNode = DOMUtils.nodeAtIndexPath(html, indexPath);
    const newSelection = {
      anchorNode: newNode,
      anchorOffset: offset,
      focusNode: newNode,
      focusOffset: offset,
    };

    newNode.textContent = textContent;

    return { html: newHTML, selection: newSelection };
  },

  /**
   * Remove the selected string from the html content. This does nothing if
   * the selection is collapsed.
   *
   * @param { EditorContent } content - The content to create from.
   *
   */
  removeSelection(content: EditorContent): EditorContent {
    if (EditorSelectionUtils.isCollapsed(content.selection)) {
      return content;
    }
    return EditorContentUtils.addString(content, '');
  },

  /**
   * Create an empty content object.
   */
  createEmptyContent(): EditorContent {
    const html = document.createElement('span');
    const selection = EditorSelectionUtils.cursorAtStart(html);
    return { html, selection };
  },
};

export default EditorContentUtils;
