/* @flow */

import EditorNodeUtils from './EditorNodeUtils';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import type { EditorNode } from './EditorNodeUtils';

export type EditorSelection = {|
  +anchorNode: EditorNode,
  +anchorOffset: number,
  +focusNode: EditorNode,
  +focusOffset: number,
|};

const EditorSelectionUtils = {
  /**
   * Converts a native browser selection object into an editor selection. This
   * will only work if the native browser selection is selecting a piece of the
   * DOM that is entirely managed by the Editor API. Returns null if the
   * selection cannot be converted.
   *
   * @param { Selection } native - Native browser selection
   */
  fromNativeSelection(native: Selection): EditorSelection | null {
    throw Error('IMPLEMENT ME');
  },

  /**
   * Validate the selection. If validation fails, an error is raised. Note that
   * a selection is assumed to be valid for all selection utility functions
   * below. If a selection is not valid, then the function will have undefined
   * behavior. A valid selection has the following properties:
   *
   *  - The anchorNode and focusNode properties are refering to nodes in the
   *    same document
   *
   *  - The anchorOffset and focusOffset are in range
   *
   * @throws { Error } If the selection is invalid.
   *
   * @param { EditorSelection } selection - the selection to validate.
   */
  validate(selection: EditorSelection): void {
    const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
    if (
      EditorNodeUtils.documentNode(anchorNode) !==
      EditorNodeUtils.documentNode(focusNode)
    ) {
      throw Error(
        'Expecting "focusNode" and "anchorNode" to refer to nodes in the same document',
      );
    }

    if (anchorOffset > anchorNode.childNodes.length) {
      throw Error('"anchorOffset" is out of range');
    }
    if (focusOffset > focusNode.childNodes.length) {
      throw Error('"focusOffset" is out of range');
    }
  },

  /**
   * Returns true if the selecton is a norm, false otherwise. Please refer to
   * documentation on the method "norm" to see how a normalized selection is
   * defined.
   *
   * @param { EditorSelection } selection - The selection
   */
  isNorm(selection: EditorSelection): boolean {
    const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

    return (
      anchorNode.nodeName === 'text' &&
      anchorOffset < anchorNode.text.length &&
      focusNode.nodeName === 'text' &&
      focusOffset < focusNode.text.length
    );
  },

  /**
   * Creates an equivalent selection that is "normalized. There are some
   * important properties that normalized selections all share:
   *
   *  - Normalized selections have anchorNode and focusNode props that are
   *    both leaf nodes
   *
   *  - Every selection has a unique normalized selection. Therefore, if two
   *    selections have the same normalized selection, they are equivalent
   *    selections. We can thus use the normalized selection to define an
   *    equivalence relation of selections.
   *
   *  - As a direct consequence of the above property, normalizing a selection
   *    is idempotent. In other words: norm(selection) == norm(norm(selection))
   *
   *  - A collapsed node has a (anchorNode, anchorOffset) pair that is
   *    equivalent to the (focusNode, focusOffset) pair.
   *
   * @param { EditorSelection } selection - The selection to normalize.
   */
  norm(selection: EditorSelection): EditorSelection {
    // TODO: Test on super-nested nodes.
    // i.e. - <span><span><span>Hello World</span></span></span> where the end
    //        offset is off the edge of the selection.

    // TODO: Need to make there is only 1 possible normalized selection for
    // any selection. Right now, we can have a normalized selection that indexes
    // the full length of text content, which is equivalent to indexing the
    // 0th index at the next leaf. This will result in subtle bugs with equality
    // checks and collapse checks (and possibly more things).
    if (EditorSelectionUtils.isNorm(selection)) {
      return selection;
    }

    const { node: anchorNode, offset: anchorOffset } = _normNodeAndOffset(
      selection.anchorNode,
      selection.anchorOffset,
    );

    const { node: focusNode, offset: focusOffset } = _normNodeAndOffset(
      selection.focusNode,
      selection.focusOffset,
    );

    return { anchorNode, anchorOffset, focusNode, focusOffset };
  },

  /**
   * Determine if two selections are equivalent.
   *
   * @param { EditorSelection } s1 - The first selection
   *
   * @param { EditorSelection } s2 - The second selection
   */
  isEqual(s1: EditorSelection, s2: EditorSelection): boolean {
    const norm1 = EditorSelectionUtils.norm(s1);
    const norm2 = EditorSelectionUtils.norm(s2);
    return (
      norm1.anchorOffset === norm2.anchorOffset &&
      norm1.anchorNode === norm2.anchorNode &&
      norm1.focusOffset === norm2.focusOffset &&
      norm1.focusNode === norm2.focusNode
    );
  },

  /**
   * A collapsed selection is one where the selection is at a single point.
   * There is no range of text that is selected.
   *
   * @param { EditorSelection} selection - The editor selection
   */
  isCollapsed(selection: EditorSelection): boolean {
    const norm = EditorSelectionUtils.norm(selection);
    return (
      norm.anchorNode === norm.focusNode &&
      norm.anchorOffset === norm.focusOffset
    );
  },

  /**
   * Collapse the selection to either the anchor or the focus of the selection.
   *
   * @param { EditorSelection } selection - The selection to collapse
   *
   * @param { string } collapseType - "to-anchor" to collapse to the anchor
   *         node, "to-focus" to collapse to the focus node.
   */
  collapse(
    selection: EditorSelection,
    collapseType: 'to-anchor' | 'to-focus',
  ): EditorSelection {
    switch (collapseType) {
      case 'to-anchor':
        return {
          anchorNode: selection.anchorNode,
          anchorOffset: selection.anchorOffset,
          focusNode: selection.anchorNode,
          focusOffset: selection.anchorOffset,
        };

      case 'to-focus':
        return {
          anchorNode: selection.focusNode,
          anchorOffset: selection.focusOffset,
          focusNode: selection.focusNode,
          focusOffset: selection.focusOffset,
        };

      default:
        throw Error(
          `collapseMode set to "${collapseType}". Must be either "to-anchor" or "to-focus"`,
        );
    }
  },

  /**
   * Returns true if the selection is defined such that the anchor comes after
   * the focus.
   *
   * @param { EditorSelection } selection - The selection object
   */
  isBackward(selection: EditorSelection): boolean {
    const norm = EditorSelectionUtils.norm(selection);
    if (norm.anchorNode === norm.focusNode) {
      return norm.anchorOffset > norm.focusOffset;
    }

    const lca = nullthrows(
      EditorNodeUtils.leastCommonAncestor(norm.anchorNode, norm.focusNode),
    );

    // NOTE: We already checked to make sure the anchor and focus nodes are
    // not the same node. We also know that, because the anchorNode and
    // focusNode come from the norm of the selection, they are both leaf nodes
    // and neither node is a sub-tree of the other. We also know that, by
    // definition of leastCommonAncestor, 1 child of the lca contains the
    // anchorNode and 1 child of the lca contains the focusNode, and they are
    // necessarily different. Therefore, all we need to do is figure out if
    // the node containing the focusNode comes earlier in the tree than the
    // node containing the anchorNode.
    for (let child of lca.childNodes) {
      if (EditorNodeUtils.containsNode(child, norm.focusNode)) {
        return true;
      } else if (EditorNodeUtils.containsNode(child, norm.anchorNode)) {
        return false;
      }
    }
    throw Error('The structure of the document tree is corrupt');
  },

  /**
   * Create a selection element that puts the cursor at the start of a
   * partcular node.
   *
   * @param { EditorNode } node - The node used to position the selection
   */
  cursorAtStart(node: EditorNode): EditorSelection {
    return {
      anchorNode: node,
      anchorOffset: 0,
      focusNode: node,
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
    const norm = EditorSelectionUtils.norm(selection);
    const { node: anchorNode, offset: anchorOffset } = _shiftCharNodeAndOffset(
      norm.anchorNode,
      norm.anchorOffset,
      n,
    );
    const { node: focusNode, offset: focusOffset } = _shiftCharNodeAndOffset(
      norm.focusNode,
      norm.focusOffset,
      n,
    );

    return { anchorNode, anchorOffset, focusNode, focusOffset };
  },
};

function _normNodeAndOffset(
  node: EditorNode,
  offset: number,
): { node: EditorNode, offset: number } {
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
        returnNode.nodeName === 'text'
          ? returnNode.text.length
          : returnNode.childNodes.length;
    } else {
      returnNode = returnNode.childNodes[returnOffset];
      returnOffset = 0;
    }
  }

  // At this point, the returnNode is gauranteed to be a leaf node. Need to make
  // sure that it is the leaf node that we want.
  invariant(
    returnNode.nodeName === 'text',
    'norm only supports leaf nodes that are "text"',
  );
  if (returnOffset === returnNode.text.length) {
    const nextNode = EditorNodeUtils.nextAdjacentLeaf(returnNode);
    // If this is the last leaf node, we will keep the offset and node as is.
    if (nextNode) {
      returnNode = nextNode;
      returnOffset = 0;
    }
  }

  return { node: returnNode, offset: returnOffset };
}

function _shiftCharNodeAndOffset(
  leaf: EditorNode,
  offset: number,
  n: number,
): { node: EditorNode, offset: number } {
  throw Error('IMPLEMENT ME!');
}

export default EditorSelectionUtils;
