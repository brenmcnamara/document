/* @flow */

import EditorNodeUtils from './EditorNodeUtils';

import type { DocumentEditorNode, EditorNode } from './EditorNodeUtils';
import type { IndexPath } from '../tree-algos/TreeAlgos';

export type EditorNodeRef = {|
  +node: EditorNode,
|};

export type EditorNodeRefType = $PropertyType<EditorNodeRef, 'type'>;

// -----------------------------------------------------------------------------
//
// EDITOR NODE REF UTILS
//
// -----------------------------------------------------------------------------

const EditorNodeRefUtils = {
  /**
   * Create a reference to a particular editor node.
   *
   * @param { EditorNode } node - The editor node
   */
  createRef(node: EditorNode): EditorNodeRef {
    return { node };
  },

  /**
   * Get a reference of a partcular node in an editor tree.
   *
   * @throws { Error } If the node could not be found
   *
   * @throws { Error } If the reference refers to a node in a different doc
   */
  getNode(doc: DocumentEditorNode, ref: EditorNodeRef): EditorNode {
    if (!EditorNodeUtils.containsNode(doc, ref.node)) {
      throw Error('Ref refers to a node in a different document');
    }
    return ref.node;
  },

  /**
   * TODO: DOCUMENT ME
   */
  isEqual(ref1: EditorNodeRef, ref2: EditorNodeRef): boolean {
    return ref1.node === ref2.node;
  },
};

export default EditorNodeRefUtils;
