/* @flow */

import TreeAlgos from './tree-algos/TreeAlgos';

import type { IndexPath } from './tree-algos/TreeAlgos';

export default {
  /**
   * Check if the ancestor dom element contains the descendant dom element.
   * This will also return true if the parent and child are the same node.
   *
   * @param { Node } ancestor - The supposed ancestor
   *
   * @param { Node } descendant - The supposed descendant
   */
  containsNode(ancestor: Node, descendant: Node) {
    return DOMTreeAlgos.containsNode(ancestor, descendant);
  },

  /**
   * Find the least common ancesor node of two DOM nodes. Returns null if the
   * two trees are not in the same DOM tree.
   *
   * @param { TNode } node1 - The first DOM node
   *
   * @param { TNode } node2 - The second DOM node
   */
  leastCommonAncestor(node1: Node, node2: Node) {
    return DOMTreeAlgos.leastCommonAncestor(node1, node2);
  },

  /**
   * Find the next adjacent leaf in the DOM tree. Returns null if a node has no
   * adjacent leaves. The following are examples of "next adjacent leaf nodes":
   *
   * @throws { Error } If passing in a node that is not a leaf node.
   *
   * @throws { Error } If the "parentNode" static method is not implemented.
   *
   * @param { Node } node - The leaf node to check for the next adjacent.
   */
  nextAdjacentLeaf(node: Node) {
    return DOMTreeAlgos.nextAdjacentLeaf(node);
  },

  /**
   * Find the previous adjacent leaf in the DOM tree. Returns null if a node
   * has no adjacent leaves. The following are examples of "previous adjacent
   * leaf nodes":
   *
   * @throws { Error } If passing in a node that is not a leaf node.
   *
   * @throws { Error } If the "parentNode" static method is not implemented.
   *
   * @param { Node } node - The leaf node to check for the previous adjacent.
   */
  prevAdjacentLeaf(node: Node) {
    return DOMTreeAlgos.prevAdjacentLeaf(node);
  },

  /**
   * Get the node at a particular index path.
   *
   * @throws { Error } If no node exists at the path.
   *
   * @param { Node } fromNode - The node to start the path
   *
   * @param { IndexPath } indexPath - The index path to navigate.
   */
  nodeAtIndexPath(root: Node, indexPath: IndexPath): Node {
    return DOMTreeAlgos.nodeAtIndexPath(root, indexPath);
  },

  /**
   * Calculates the index path from a node to another.
   *
   * @throws { Error } If no path exists to the node
   *
   * @param { Node } fromNode - The node at the start of the path
   *
   * @param { TNode } node - The node at the end of the path
   */
  indexPathToNode(fromNode: Node, toNode: Node): IndexPath {
    return DOMTreeAlgos.indexPathToNode(fromNode, toNode);
  },
};

class DOMTreeAlgos extends TreeAlgos<Node> {
  static childNodes(node: Node) {
    return node.childNodes;
  }

  static parentNode(node: Node) {
    return node.parentNode || null;
  }
}
