/* @flow */

import nullthrows from 'nullthrows';

export type EditorSelection = {|
  +anchorNode: Node,
  +anchorOffset: number,
  +focusNode: Node,
  +focusOffset: number,
|};

export default {
  /**
   * Converts a native browser selection object into an editor selection.
   *
   * @param { Selection } native - Native browser selection
   */
  fromNativeSelection(native: Selection): EditorSelection {
    return {
      anchorNode: nullthrows(native.anchorNode),
      anchorOffset: native.anchorOffset,
      focusNode: nullthrows(native.focusNode),
      focusOffset: native.focusOffset,
    };
  },

  /**
   * A collapsed selection is one where the selection is at a single point.
   * There is no range of text that is selected.
   *
   * @param { EditorSelection} selection - The editor selection
   */
  isCollapsed(selection: EditorSelection): boolean {
    return (
      selection.anchorNode === selection.focusNode &&
      selection.anchorOffset === selection.focusOffset
    );
  },

  /**
   * Determine if two selections are equivalent.
   *
   * @param { EditorSelection } s1 - The first selection
   * @param { EditorSelection } s2 - The second selection
   */
  isEqual(s1: EditorSelection, s2: EditorSelection): boolean {
    return (
      s1.anchorOffset === s2.anchorOffset &&
      s1.anchorNode === s2.anchorNode &&
      s1.focusOffset === s2.focusOffset &&
      s1.focusNode === s2.focusNode
    );
  },

  /**
   * Create a selection element that puts the cursor at the start of a
   * partcular html element.
   *
   * @param { HTMLElement } element - The element used to position the selection
   */
  cursorAtStart(element: HTMLElement): EditorSelection {
    return {
      anchorNode: element,
      anchorOffset: 0,
      focusNode: element,
      focusOffset: 0,
    };
  },
};
