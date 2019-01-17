/* @flow */

import IterUtils from './iter-utils/IterUtils';
import TreeAlgos from './tree-algos/TreeAlgos';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import type { IndexPath } from './tree-algos/TreeAlgos';

export type EditorNode =
  | BoldEditorNode
  | CodeBlockEditorNode
  | DocumentEditorNode
  | H1EditorNode
  | H2EditorNode
  | H3EditorNode
  | ItalicEditorNode
  | PEditorNode
  | TextEditorNode
  | UnderlineEditorNode;

// -----------------------------------------------------------------------------
//
// DOC NODES
//
// -----------------------------------------------------------------------------

export type DocumentEditorNode = EditorNodeStub<'doc'>;

// -----------------------------------------------------------------------------
//
// CONTENT HIERARCHY NODES
//
// -----------------------------------------------------------------------------

export type ContentHierarchyEditorNode =
  | H1EditorNode
  | H2EditorNode
  | H3EditorNode
  | PEditorNode;

export type H1EditorNode = EditorNodeStub<'h1'>;

export type H2EditorNode = EditorNodeStub<'h2'>;

export type H3EditorNode = EditorNodeStub<'h3'>;

export type PEditorNode = EditorNodeStub<'p'>;

export type CodeBlockEditorNode = EditorNodeStub<'codeblock'>;

// -----------------------------------------------------------------------------
//
// TEXT DECORATION NODES
//
// -----------------------------------------------------------------------------

export type TextDecorationEditorNode =
  | BoldEditorNode
  | ItalicEditorNode
  | UnderlineEditorNode;

export type BoldEditorNode = EditorNodeStub<'b'>;

export type ItalicEditorNode = EditorNodeStub<'i'>;

export type UnderlineEditorNode = EditorNodeStub<'u'>;

// -----------------------------------------------------------------------------
//
// TEXT NODES
//
// -----------------------------------------------------------------------------

export type TextEditorNode = EditorNodeStub<'text'> & { +text: string };

// -----------------------------------------------------------------------------
//
// NODE STUB
//
// -----------------------------------------------------------------------------

export type EditorNodeStub<TName: string> = {
  +childNodes: Array<EditorNode>,
  +nodeName: TName,
  +parentNode: EditorNode | null,
};

// -----------------------------------------------------------------------------
//
// EDITOR NODE UTILS
//
// -----------------------------------------------------------------------------

const EditorNodeUtils = {
  /**
   * Check if the document node is a valid node. A valid document node has
   * the following properties.
   *
   *  - The parentNode and childNodes agree on the structure of the tree.
   *
   *  - The root document null has no parent node
   *
   *  - The root document must have no nodes in its subtree that are also
   *    documents
   *
   * @throws { Error } If any of the validation properties are violated.
   */
  validate(doc: DocumentEditorNode): void {
    if (doc.parentNode) {
      throw Error('The root document node cannot have a parent');
    }

    for (let node of EditorTreeAlgos.dfsInfixIterable(doc)) {
      if (node !== doc && node.nodeName === 'doc') {
        throw Error('Only the root node may be a document node');
      }

      if (node !== doc && !node.parentNode) {
        throw Error('Node in document is missing reference to parent');
      }

      if (node.childNodes.some(child => child.parentNode !== node)) {
        throw Error('parentNode and childNodes structures do not agree');
      }
    }
  },

  /**
   * Returns true if the two nodes are equivalent to one another. This performs
   * a deep equality check.
   *
   * @param { EditorNode } node1 - The frst node
   *
   * @param { EditorNode } node2 - The second node
   */
  isEqual(node1: EditorNode, node2: EditorNode): boolean {
    if (node1 === node2) {
      return true;
    }

    const zipped = IterUtils.zipExhaust(
      IterUtils.iterFromIterable(EditorTreeAlgos.dfsInfixIterable(node2)),
      IterUtils.iterFromIterable(EditorTreeAlgos.dfsInfixIterable(node1)),
    );
    let result = zipped.next();
    while (!result.done) {
      const [first, second] = result.value;
      if (!first || !second) {
        return Boolean(first) === Boolean(second);
      }

      if (!_isEqualShallow(first, second)) {
        return false;
      }
      result = zipped.next();
    }
    return true;
  },

  /**
   * Check if the parent node contains the child node. This will also return
   * true if the parent and child are the same node.
   *
   * @param { EditorNode } ancestor - The supposed ancestor
   *
   * @param { EditorNode } descendant - The supposed descendant
   */
  containsNode(ancestor: EditorNode, descendant: EditorNode) {
    return EditorTreeAlgos.containsNode(ancestor, descendant);
  },

  /**
   * Get the document node that a node belongs within.
   *
   * @param { EditorNode } node - The node
   */
  documentNode(node: EditorNode): DocumentEditorNode {
    let next = node;
    while (next.nodeName !== 'doc') {
      next = nullthrows(next.parentNode);
    }
    return next;
  },

  /**
   * Clone a document. This makes a deep clone of the document and its
   * entire subtree.
   *
   * @param { DocumentEditorNode } doc - The node to clone
   */
  cloneDocumentNode(doc: DocumentEditorNode): DocumentEditorNode {
    // TODO: Need to keep track of pairs between nodes from the origin tree.
    // This is used to lookup nodes based on their pair. This data structure
    // is inefficient because it takes O(n) time to lookup the nodes. Goal is
    // to create nodes that are hashable so that this lookup can be faster.
    const nodeToClonePairs: Array<[EditorNode, EditorNode]> = [];

    let node: DocumentEditorNode | null = null;

    // NOTE: we will be iterating nodes and cloning the nodes. The iteration
    // order is important: we need to assume that if a node is being enumerated
    // then its parent has already been enumerated. The dfsInfixIterable gives
    // us this gaurantee.
    for (let next of EditorTreeAlgos.dfsInfixIterable(doc)) {
      // NOTE: The parent does not exist for the root node.
      const parentCopy =
        next.parentNode &&
        nullthrows(
          nodeToClonePairs.find(pair => pair[0] === next.parentNode),
        )[1];

      // Make a shallow copy of the node. All the properties are correct except
      // for the childNodes array, which has references to nodes in the doc that
      // is being cloned. As we iterate and clone the children, we will replace
      // these references with the cloned counterparts.
      // $FlowFixMe - Need to find a good way around this issue.
      const copy: EditorNode = {
        ...next,
        childNodes: next.childNodes.slice(),
        parentNode: parentCopy,
      };

      nodeToClonePairs.push([next, copy]);

      // The infix iterable will enumerate the root node first. If the root
      // node is not set, it is because this is the first iteration.
      if (copy.nodeName === 'doc') {
        invariant(!node, 'Expecting node to not be defined yet');
        node = copy;
      }

      // We need to update the childNodes array of the parent to replace the
      // existing node with its copy.
      if (parentCopy) {
        const indexOfOriginal = parentCopy.childNodes.indexOf(next);
        if (indexOfOriginal < 0) {
          throw Error('parentNode and childNodes structures do not agree');
        }
        parentCopy.childNodes.splice(indexOfOriginal, 1, copy);
      }
    }

    return nullthrows(node);
  },

  /**
   * Find the least common ancesor node of two nodes. Returns null if the two
   * trees are not in the same tree.
   *
   * @throws { Error } If the "parentNode" method is unimplemented.
   *
   * @param { EditorNode } node1 - The first tree node
   *
   * @param { EditorNode } node2 - The second tree node
   */
  leastCommonAncestor(node1: EditorNode, node2: EditorNode): EditorNode | null {
    return EditorTreeAlgos.leastCommonAncestor(node1, node2);
  },

  /**
   * Calculates the index path from a node to another.
   *
   * @throws { Error } If no path exists to the node
   *
   * @param { EditorNode } fromNode - The node at the start of the path
   *
   * @param { EditorNode } toNode - The node at the end of the path
   */
  indexPathToNode(fromNode: EditorNode, toNode: EditorNode): IndexPath {
    return EditorTreeAlgos.indexPathToNode(fromNode, toNode);
  },

  /**
   * Get the node at a particular index path.
   *
   * @throws { Error } If no node exists at the path.
   *
   * @param { EditorNode } fromNode - The node to start the path
   *
   * @param { IndexPath } indexPath - The index path to navigate.
   */
  nodeAtIndexPath(fromNode: EditorNode, indexPath: IndexPath): EditorNode {
    return EditorTreeAlgos.nodeAtIndexPath(fromNode, indexPath);
  },

  /**
   * Find the next adjacent leaf in the tree. Returns null if a node has no
   * adjacent leaves.
   *
   * @throws { Error } If passing in a node that is not a leaf node.
   *
   * @throws { Error } If the "parentNode" static method is not implemented.
   *
   * @param { EditorNode } node - The leaf node to check for the next adjacent.
   */
  nextAdjacentLeaf(node: EditorNode): EditorNode | null {
    return EditorTreeAlgos.nextAdjacentLeaf(node);
    },

  /**
   * Find the previous adjacent leaf in the tree. Returns null if a node has no
   * adjacent leaves.
   *
   * @throws { Error } If passing in a node that is not a leaf node.
   *
   * @throws { Error } If the "parentNode" static method is not implemented.
   *
   * @param { EditorNode } node - The leaf node to check for the previous adjacent.
   */
  prevAdjacentLeaf(node: EditorNode): EditorNode | null {
    return EditorTreeAlgos.prevAdjacentLeaf(node);
  },
};

export default EditorNodeUtils;

// -----------------------------------------------------------------------------
//
// TREE ALGOS
//
// -----------------------------------------------------------------------------

class EditorTreeAlgos extends TreeAlgos<EditorNode> {
  static childNodes(node: EditorNode): Iterable<EditorNode> {
    return node.childNodes;
  }

  static parentNode(node: EditorNode): EditorNode | null {
    return node.parentNode;
  }
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function _shallowCopy(node: EditorNode) {
  // $FlowFixMe - Need a way to avoid these types of errors
  return { ...node, childNodes: node.childNodes.slice() };
}

function _isEqualShallow(node1: EditorNode, node2: EditorNode): boolean {
  const keys1 = Object.keys(node1);
  const keys2 = Object.keys(node2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (
      key !== 'parentNode' &&
      key !== 'childNodes' &&
      node1[key] !== node2[key]
    ) {
      return false;
    }
  }
  return true;
}
