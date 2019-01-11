/* @flow */

import TreeAlgos from './tree-algos/TreeAlgos';

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
   * @param { TNode } node - The leaf node to check for the next adjacent.
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
    * @param { TNode } node - The leaf node to check for the previous adjacent.
    */
    prevAdjacentLeaf(node: Node) {
      return DOMTreeAlgos.prevAdjacentLeaf(node);
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
