/* @flow */

import DOMUtils from './DOMUtils';
import EditorNodeUtils from './EditorNodeUtils';
import EditorSelectionUtils from './EditorSelectionUtils';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import type { DocumentEditorNode, EditorNode } from './EditorNodeUtils';
import type { EditorContent } from './EditorContentUtils';
import type { EditorSelection } from './EditorSelectionUtils';

/**
 * Set the content on the DOM.
 *
 * @param { Node } parentOfHTMLDocument - The parent of the html node
 *        representing the document.
 *
 * @param { EditorContent } content - The content to set on the DOM.
 */
export default function setEditorContent(
  parentOfHTMLDocument: Node,
  content: EditorContent,
): void {
  setEditorNode(parentOfHTMLDocument, content.doc);
  setEditorSelection(parentOfHTMLDocument.childNodes[0], content.sel);
}

/**
 * Set the document tree on the html document.
 *
 * @param { Node } parentOfHTMLDocument - The parent of the html node
 *        representing the document.
 *
 * @param { EditorContent } content - The content to set on the DOM.
 */
function setEditorNode(
  parentOfHTMLDocument: Node,
  doc: DocumentEditorNode,
): void {
  console.log('setting editor content');
  const htmlDocument = createDOMNode(doc);
  const nodeIDToDOMNode = { [doc.id]: htmlDocument };

  // NOTE: The depth-first-search infix iterable gaurantees that we enumerate
  // the parent of a node before the node itself. This is an important, implicit
  // assumption in the below loop. This is because we fetch the parent dom node
  // that was fetched on an earlier enumeration. We also make the implicit
  // assumption that the we are iterating children from left to right when we
  // are appending the children to the parent nodes.
  for (let node of EditorNodeUtils.dfsInfixIterable(doc)) {
    if (node === doc) {
      continue;
    }
    const parentID = nullthrows(node.parentNode).id;
    const parentDOMNode = nullthrows(nodeIDToDOMNode[parentID]);
    const domNode = createDOMNode(node);
    parentDOMNode.appendChild(domNode);
  }

  // At this point, we are done creating the html document. Now we need to
  // attach it to the DOM.
  invariant(
    parentOfHTMLDocument.childNodes.length <= 1,
    'Expecting parent of html document node to have no more than 1 child',
  );
  if (parentOfHTMLDocument.childNodes.length === 0) {
    parentOfHTMLDocument.appendChild(htmlDocument);
  } else {
    parentOfHTMLDocument.replaceChild(
      htmlDocument,
      parentOfHTMLDocument.childNodes[0],
    );
  }
}

/**
 * Set the selection on the DOM.
 *
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * @param { Node } htmlDocument - The root html node of the document.
 *
 * @param { EditorSelection } selection - The selection to set on the DOM.
 *
 * @throws { Error } Throws an error if the selection is defined on nodes that
 *         are not connected to the DOM.
 *
 * @throw { Error } If trying to set backwards selection on browser that does
 *        not support backwards selection.
 */
function setEditorSelection(htmlDocument: Node, sel: EditorSelection): void {
  // TODO: What happens when the node is not focused??

  // TODO: Not sure when this will happen, need to look more into when the
  // "getSelection" function returns null.
  const nativeSel = global.getSelection();
  if (!nativeSel) {
    console.warn('Unable to perform selection at this time');
    return;
  }

  const {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  } = getDOMSelectionInfo(htmlDocument, sel);

  // It's possible that the editor has been removed from the DOM (or was never
  // in the DOM) but our selection code doesn't know it yet. Forcing selection
  // in this case may lead to errors, so just bail now.
  if (
    !document.documentElement ||
    !DOMUtils.containsNode(document.documentElement, anchorNode) ||
    !DOMUtils.containsNode(document.documentElement, focusNode)
  ) {
    throw Error('Trying to select DOM node that is not attached to DOM');
  }

  const isBackward = EditorSelectionUtils.isBackward(sel);

  // IE doesn't support backward selection. Swap key/offset pairs.
  if (!nativeSel.extend && isBackward) {
    throw Error('Browser does not support backward selection');
  }

  const range = document.createRange();

  // TODO: Backward selection not implemented!
  if (isBackward) {
    throw Error('IMPLEMENT BACKWARD SELECTION!');
  } else {
    range.setStart(anchorNode, anchorOffset);
    range.setEnd(focusNode, focusOffset);
  }

  // ---------------------------------------------------------------------------
  // MUTATION ZONE! ALL SIDE EFFECTS HAPPEN BELOW THIS MARK
  // ---------------------------------------------------------------------------

  nativeSel.removeAllRanges();
  nativeSel.addRange(range);
}

/**
 * Create a detached DOM node from an editor node. This will only create the
 * corresponding node for the editor node, not the sub-tree of the node.
 *
 * @param { EditorNode } editorNode - The editor node
 */
function createDOMNode(editorNode: EditorNode): Node {
  switch (editorNode.nodeName) {
    case 'b': {
      return document.createElement('strong');
    }

    case 'doc': {
      return document.createElement('div');
    }

    case 'text': {
      return document.createTextNode(editorNode.text);
    }

    default:
      return invariant(
        false,
        'Unrecognized editor node: "%s"',
        editorNode.nodeName,
      );
  }
}

/**
 * Get the native DOM elements and offsets for the selection on a particular
 * html document.
 *
 * @param { Node } htmlDocument - The root html node of the document.
 *
 * @param { EditorSelection } sel - The editor selection
 */
function getDOMSelectionInfo(
  htmlDocument: Node,
  sel: EditorSelection,
): {
  anchorNode: Node,
  anchorOffset: number,
  focusNode: Node,
  focusOffset: number,
} {
  // NOTE: For now, there is a 1:1 relationship between Editor Nodes and
  // html nodes. This may change in the future and having this function to
  // abstract the different formats is important.
  const documentNode = EditorNodeUtils.documentNode(sel.anchorNode);

  const anchorIndexPath = EditorNodeUtils.indexPathToNode(
    documentNode,
    sel.anchorNode,
  );
  const focusIndexPath = EditorNodeUtils.indexPathToNode(
    documentNode,
    sel.focusNode,
  );

  const anchorNode = DOMUtils.nodeAtIndexPath(htmlDocument, anchorIndexPath);
  const focusNode = DOMUtils.nodeAtIndexPath(htmlDocument, focusIndexPath);
  return {
    anchorNode,
    anchorOffset: sel.anchorOffset,
    focusNode,
    focusOffset: sel.focusOffset,
  };
}
