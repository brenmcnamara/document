/* @flow */

import nullthrows from 'nullthrows';

type Iterable<T> = {
  @@iterator(): Iterator<T>,
};

type OptionalImpl<T> = T | '__NOT_IMPLEMENTED__';

/**
 * An abstract base class that contains common tree-based algorithms without
 * making assumptions about the structure of the tree and how to traverse ndoes.
 * @class
 */
export default class TreeAlgos<TNode> {
  /**
   * An abstract method for defining how to query a node for its child nodes.
   * This method must be overridden.
   *
   * @param { TNode } node - The node to query
   */
  static childNodes(node: TNode): Iterable<TNode> {
    throw Error(`Expecting subclass of TreeAlgos to implement childNodes`);
  }

  /**
   * An abstract method for defining how to query a node for its immediate
   * parent. This method may optionally be implemented.
   *
   * @param { TNode } node - The tree node
   */
  static parentNode(node: TNode): OptionalImpl<TNode | null> {
    return '__NOT_IMPLEMENTED__';
  }

  /**
   * Find the first node in the tree that matches the predicate. Returns null
   * if no node matches the predicate.
   *
   * @param { TNode } root - The root node of the tree to start the search
   *
   * @param { (TNode) => boolean } - The predicate function to determine a match
   */
  static find(root: TNode, predicate: TNode => boolean): TNode | null {
    for (let node of this.dfsInfixIterable(root)) {
      if (predicate(node)) {
        return node;
      }
    }
    return null;
  }

  /**
   * Check if the parent dom element contains the child dom element. This will
   * also return true if the parent and child are the same node.
   *
   * @param { Node } ancestor - The supposed ancestor
   *
   * @param { Node } descendant - The supposed descendant
   */
  static containsNode(ancestor: TNode, descendant: TNode): boolean {
    if (ancestor === descendant) {
      return true;
    }

    let node = this.parentNode(descendant);
    if (node === '__NOT_IMPLEMENTED__') {
      // We do not have easy access to the parent nodes of this node. We will
      // use a depth first search to look for the descendant.
      for (let _node of this.dfsInfixIterable(ancestor)) {
        if (_node === descendant) {
          return true;
        }
      }
      return false;
    }

    // Have access to parent nodes. We can do a quick iteration up the parent
    // nodes to find if the node has the correct ancestor.
    while (node) {
      if (node === ancestor) {
        return true;
      }
      node = unimplThrows(this.parentNode(node));
    }
    return false;
  }

  /**
   * Find the least common ancesor node of two nodes. Returns null if the two
   * trees are not in the same tree.
   *
   * @throws { Error } If the "parentNode" method is unimplemented.
   *
   * @param { TNode } node1 - The first tree node
   *
   * @param { TNode } node2 - The second tree node
   */
  static leastCommonAncestor(node1: TNode, node2: TNode): TNode | null {
    if (node1 === node2) {
      return node1;
    }

    const node1Path = Array.from(this.pathToParent(node1)).reverse();
    const node2Path = Array.from(this.pathToParent(node2)).reverse();

    // Iterate down the paths until the nodes no longer have an ancestor in
    // common.
    let commonAncestor = null;
    for (let i = 0; i < Math.min(node1Path.length, node2Path.length); ++i) {
      if (node1Path[i] !== node2Path[i]) {
        break;
      }
      commonAncestor = node1Path[i];
    }
    return commonAncestor;
  }

  /**
   * Create an iterable object that starts from the first node and iterates
   * to the last node.
   *
   * @throws { Error } If there is no path from the first to the second node.
   *
   * @param { TNode } fromNode - The node at the start of the path
   *
   * @param { TNode } toNode - The node at the end of the path
   */
  static pathToChild(fromNode: TNode, toNode: TNode): Iterable<TNode> {
    const iterator = () => {
      let stack;

      if (this.parentNode(toNode) === '__NOT_IMPLEMENTED__') {
        stack = this._pathToChildUsingChildNodes(fromNode, toNode).reverse();
      } else {
        stack = [];
        // Can use the parent node for a quicker iteration algo.
        let foundFromNode = false;
        for (let node of this.pathToParent(toNode)) {
          stack.push(node);
          if (node === fromNode) {
            foundFromNode = true;
            break;
          }
        }

        if (!foundFromNode) {
          throw Error('Could not find path between nodes');
        }
      }

      return {
        next: () => {
          if (stack.length === 0) {
            return { done: true };
          }
          return { done: false, value: stack.pop() };
        },
      };
    };

    return { [Symbol.iterator]: iterator };
  }

  /**
   * Create an iterable object that starts from the original node and walks
   * up the tree to the parent node.
   *
   * @throws { Error } If the "parentNode" method is unimplemented.
   *
   * @param { TNode } node - The node to start the path
   */
  static pathToParent(node: TNode): Iterable<TNode> {
    const iterator = () => {
      let current: TNode | null = node;
      return {
        next: () => {
          if (!current) {
            return { done: true };
          }
          const value = current;
          current = unimplThrows(this.parentNode(current));
          return { done: false, value };
        },
      };
    };

    return { [Symbol.iterator]: iterator };
  }

  /**
   * Create an iterable object for iterating through the descendants of a node
   * using an infix depth-first-search.
   *
   * @param { TNode } root - The root node to start the depth first search
   */
  static dfsInfixIterable(root: TNode): Iterable<TNode> {
    const iterator = () => {
      const stack = [root];
      return {
        next: () => {
          if (stack.length === 0) {
            return { done: true };
          }
          const node = stack.pop();
          stack.push.apply(stack, Array.from(this.childNodes(node)).reverse());
          return { done: false, value: node };
        },
      };
    };

    return { [Symbol.iterator]: iterator };
  }

  static _pathToChildUsingChildNodes(
    fromNode: TNode,
    toNode: TNode,
  ): Array<TNode> {
    // NOTE: Need to create a mapping from child to parent, but we cannot make
    // the assumption that nodes can be hashed, therefore we can't use any
    // key-value storage. Instead, we will keep a list of node pairs. This
    // solution is sub-optimal, but it is the cost of not having parent
    // references for nodes.
    let childToParentPairs: Array<[TNode, TNode]> = [];

    let foundToNode = false;
    for (let node of this.dfsInfixIterable(fromNode)) {
      // NOTE: Because we are doing an infix depth-first search, we can assume
      // that a node's ancestors have been visited before the node has been
      // visited. This is an important semantic detail of this loop. Once we
      // break out of this loop, we need to walk up the parents.
      if (node === toNode) {
        foundToNode = true;
        break;
      }

      for (let childNode of this.childNodes(node)) {
        childToParentPairs.push([childNode, node]);
      }
    }

    if (!foundToNode) {
      throw Error('Could not find path between nodes');
    }

    const path = [toNode];

    while (path[0] !== fromNode) {
      const parent = nullthrows(
        childToParentPairs.find(pair => pair[0] === path[0]),
      )[1];
      path.unshift(parent);
    }

    return path;
  }
}

function unimplThrows<T>(value: OptionalImpl<T>): T {
  if (value === '__NOT_IMPLEMENTED__') {
    throw Error('Expecting value to be implemented');
  }
  return value;
}
