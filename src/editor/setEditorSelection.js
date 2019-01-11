/* @flow */

import DOMUtils from './DOMUtils';
import EditorSelectionUtils from './EditorSelectionUtils';

import invariant from 'invariant';

import type { EditorSelection } from './EditorSelectionUtils';

/**
 * Set the selection on the DOM.
 *
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 *
 * @param { EditorSelection } selection - The selection to set on the DOM.
 *
 * @throws { Error } Throws an error if the selection is defined on nodes that
 *         are not connected to the DOM.
 *
 * @throw { Error } If trying to set backwards selection on browser that does
 *        not support backwards selection.
 */
export default function setEditorSelection(sel: EditorSelection): void {
  // TODO: Backwards selection not implemented!!
  // TODO: What happens when the node is not focused??

  // It's possible that the editor has been removed from the DOM but
  // our selection code doesn't know it yet. Forcing selection in
  // this case may lead to errors, so just bail now.
  if (
    !document.documentElement ||
    !DOMUtils.containsNode(document.documentElement, sel.anchorNode) ||
    !DOMUtils.containsNode(document.documentElement, sel.focusNode)
  ) {
    throw Error('Trying to select DOM node that is not attached to DOM');
  }

  const nativeSel = global.getSelection();
  const isBackward = EditorSelectionUtils.isBackward(sel);

  // IE doesn't support backward selection. Swap key/offset pairs.
  if (!nativeSel.extend && isBackward) {
    throw Error('Browser does not support backward selection');
  }

  const range = document.createRange();

  if (isBackward) {
    // range.setStart();
  } else {
    range.setStart(sel.anchorNode, sel.anchorOffset);
    range.setEnd(sel.focusNode, sel.focusOffset);
  }

  // ---------------------------------------------------------------------------
  // MUTATION ZONE! ALL SIDE EFFECTS HAPPEN BELOW THIS MARK
  // ---------------------------------------------------------------------------
  nativeSel.removeAllRanges();
  nativeSel.addRange(range);
}
