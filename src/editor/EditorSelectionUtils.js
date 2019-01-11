/* @flow */

import DOMUtils from './DOMUtils';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

export type EditorSelection = {|
  +anchorNode: Node,
  +anchorOffset: number,
  +focusNode: Node,
  +focusOffset: number,
|};

const EditorSelectionUtils = {
  /**
   * Converts a native browser selection object into an editor selection.
   *
   * @param { Selection } native - Native browser selection
   */
  fromNativeSelection(native: Selection): EditorSelection | null {
    const { anchorNode, anchorOffset, focusNode, focusOffset } = native;
    if (!anchorNode || !focusNode) {
      return null;
    }

    return { anchorNode, anchorOffset, focusNode, focusOffset };
  },

  /**
   * A collapsed selection is one where the selection is at a single point.
   * There is no range of text that is selected.
   *
   * @param { EditorSelection} selection - The editor selection
   */
  isCollapsed(selection: EditorSelection): boolean {
    const normalized = EditorSelectionUtils.normalize(selection);
    return (
      normalized.anchorNode === normalized.focusNode &&
      normalized.anchorOffset === normalized.focusOffset
    );
  },

  /**
   * Determine if two selections are equivalent.
   *
   * @param { EditorSelection } s1 - The first selection
   *
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
   * Returns true if the selection is defined such that the anchor comes after
   * the focus.
   *
   * @param { EditorSelection } selection - The selection object
   */
  isBackward(selection: EditorSelection): boolean {
    const normalized = EditorSelectionUtils.normalize(selection);
    const { anchorNode, anchorOffset, focusNode, focusOffset } = normalized;

    if (anchorNode === focusNode) {
      return anchorOffset > focusOffset;
    }

    const lca = DOMUtils.leastCommonAncestor(anchorNode, focusNode);

    if (!lca) {
      throw Error(
        'Malformed EditorSelection: anchorNode and focusNode are not in the same DOM tree',
      );
    }

    // NOTE: Because we normalized the selection, we know that the anchor node
    // and focus node are both leaf nodes in the DOM. We also know that they
    // are not the same node because we checked that corner case above.
    // Therefore, the lca of the two nodes must be a node different than both
    // of them. This also means that of the immediate children of the lca,
    // one of the children is an ancestor of the anchorNode and one of the
    // children is an ancestor of the focusNode. The ancestors of the two nodes
    // must necessarily be different by definition of what an "LCA" is. We will
    // use the index of these two ancestors to determine the ordering of the
    // focus and anchor nodes.
    let i = 0;
    let anchorAncestorIndex = -1;
    let focusAncestorIndex = -1;
    for (let node of lca.childNodes) {
      if (anchorAncestorIndex >= 0 && focusAncestorIndex >= 0) {
        break;
      }

      if (anchorAncestorIndex < 0 && DOMUtils.containsNode(node, anchorNode)) {
        anchorAncestorIndex = i;
      }

      if (focusAncestorIndex < 0 && DOMUtils.containsNode(node, focusNode)) {
        focusAncestorIndex = i;
      }

      ++i;
    }

    return anchorAncestorIndex > focusAncestorIndex;
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

  /**
   * Shift the selection forward by n characters. You may specify a negative
   * integer to shift backward.
   *
   * @param { EditorSelection } selection - The selection to shift
   *
   * @param { number } n - The number of elements to shift forward. This must be
   *        an integer.
   *
   * @param { boolean } [collapseAtEnd] - An optional parameter specifying if
   *        the end of the selection is passed, the selection should begin
   *        collapsing itself. Default is false
   */
  shiftChar(selection: EditorSelection, n: number): EditorSelection {
    const normalized = EditorSelectionUtils.normalize(selection);
    const { node: anchorNode, offset: anchorOffset } = _shiftCharNodeAndOffset(
      normalized.anchorNode,
      normalized.anchorOffset,
      n,
    );
    const { node: focusNode, offset: focusOffset } = _shiftCharNodeAndOffset(
      normalized.focusNode,
      normalized.focusOffset,
      n,
    );

    return { anchorNode, anchorOffset, focusNode, focusOffset };
  },

  /**
   * Creates an equivalent selection that is "normalized". A normalized
   * selection is one where the anchorNode and the focusNode are leaf nodes.
   *
   * @param { EditorSelection } selection - The selection to normalize.
   */
  normalize(selection: EditorSelection): EditorSelection {
    // TODO: Test on super-nested nodes.
    // i.e. - <span><span><span>Hello World</span></span></span> where the end
    //        offset is off the edge of the selection.

    if (
      selection.anchorNode.childNodes.length === 0 &&
      selection.focusNode.childNodes.length === 0
    ) {
      // This selection is already normalized.
      return selection;
    }

    const { node: anchorNode, offset: anchorOffset } = _normalizeNodeAndOffset(
      selection.anchorNode,
      selection.anchorOffset,
    );

    const { node: focusNode, offset: focusOffset } = _normalizeNodeAndOffset(
      selection.focusNode,
      selection.focusOffset,
    );

    return { anchorNode, anchorOffset, focusNode, focusOffset };
  },

  /**
   * Collapse the selection to either the anchor or the focus of the selection.
   *
   * @param { EditorSelection } selection - The selection to collapse
   *
   * @param { string } anchorOrFocus - "anchor" to collapse to the anchor node,
   *        "focus" to collapse to the focus node.
   */
  collapseTo(
    selection: EditorSelection,
    anchorOrFocus: 'anchor' | 'focus',
  ): EditorSelection {
    switch (anchorOrFocus) {
      case 'anchor':
        return {
          anchorNode: selection.anchorNode,
          anchorOffset: selection.anchorOffset,
          focusNode: selection.anchorNode,
          focusOffset: selection.focusOffset,
        };

      case 'focus':
        return {
          anchorNode: selection.focusNode,
          anchorOffset: selection.focusOffset,
          focusNode: selection.focusNode,
          focusOffset: selection.focusOffset,
        };

      default:
        throw Error(
          `anchorOrFocus set to "${anchorOrFocus}". Must be either "anchor" or "focus"`,
        );
    }
  },
};

function _normalizeNodeAndOffset(
  node: Node,
  offset: number,
): { node: Node, offset: number } {
  let snapToEnd = false;

  let returnNode = node;
  let returnOffset = offset;

  while (returnNode.childNodes.length > 0) {
    if (returnNode.childNodes.length <= returnOffset) {
      snapToEnd = true;
    }

    // Change the anchor offset as we are moving down the tree.
    if (snapToEnd) {
      returnNode = returnNode.childNodes[returnNode.childNodes.length - 1];
      returnOffset =
        returnNode.childNodes.length > 0
          ? returnNode.childNodes.length
          : returnNode.textContent.length;
    } else {
      returnNode = returnNode.childNodes[returnOffset];
      returnOffset = 0;
    }
  }
  return { node: returnNode, offset: returnOffset };
}

function _shiftCharNodeAndOffset(
  leaf: Node,
  offset: number,
  n: number,
): { node: Node, offset: number } {
  let returnNode = leaf;
  let returnOffset = offset + n;
  while (returnOffset > returnNode.textContent.length) {
    const prevNode = returnNode;
    returnNode = DOMUtils.nextAdjacentLeaf(returnNode);
    if (!returnNode) {
      throw Error('Trying to shift to character out of range');
    }
    returnOffset = returnOffset - prevNode.textContent.length;
    invariant(returnOffset >= 0, 'Offset should never be < 0');
  }

  return { node: returnNode, offset: returnOffset };
}

export default EditorSelectionUtils;
