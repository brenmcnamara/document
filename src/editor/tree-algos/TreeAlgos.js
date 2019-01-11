/* @flow */

import invariant from 'invariant';
import nullthrows from 'nullthrows';

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
   * Returns true if the node is a leaf node, false otherwise.
   *
   * @param { TNode } node - The node to check
   */
  static isLeaf(node: TNode): boolean {
    const childIter = IterUtils.iterFromIterable(this.childNodes(node));
    return !IterUtils.first(childIter);
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
    // $FlowFixMe - This is correct
    const iteratorFn: () => Iterator<TNode> = () => {
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

    return IterUtils.createIterable(iteratorFn);
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
    // $FlowFixMe - This is correct
    const iteratorFn: () => Iterator<TNode> = () => {
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

    return IterUtils.createIterable(iteratorFn);
  }

  /**
   * Find the next adjacent leaf in the tree. Returns null if a node has no
   * adjacent leaves. The following are examples of "next adjacent leaf nodes":
   *
   *           *
   *           |
   *      -----------
   *      |         |
   *    -----     -----
   *    |   |     |   |
   *   (A) (B)   (C) (D)
   *
   * - The next adjacent leaf of (A) is (B)
   * - The next adjacent leaf of (B) is (C)
   * - The next adjacent leaf of (D) is (null)
   *
   * @throws { Error } If passing in a node that is not a leaf node.
   *
   * @throws { Error } If the "parentNode" static method is not implemented.
   *
   * @param { TNode } node - The leaf node to check for the next adjacent.
   */
  static nextAdjacentLeaf(node: TNode): TNode | null {
    if (!this.isLeaf(node)) {
      throw Error('Expecting node to be a leaf node');
    }

    let parent = unimplThrows(this.parentNode(node));
    let child = node;

    let nodeToExplore = null;

    while (parent) {
      const childIter = IterUtils.iterFromIterable(this.childNodes(parent));
      const foundChildNode = IterUtils.iterateTo(childIter, child);
      invariant(
        foundChildNode,
        'parentNode and childNodes do not agree on structure of tree',
      );
      const { done, value } = childIter.next();
      if (!done) {
        // Found the desired child node to explore for a next leaf.
        nodeToExplore = value;
        break;
      }
      // The node has no next sibling. Need to search for the adjacent leaf
      // at the next parent.
      child = parent;
      parent = unimplThrows(this.parentNode(parent));
    }

    // We need to find the left-most leaf of the node to explore.
    let isLeaf = false;
    while (nodeToExplore && !isLeaf) {
      const childIter = IterUtils.iterFromIterable(
        this.childNodes(nodeToExplore),
      );
      const firstChild = IterUtils.first(childIter);
      if (firstChild) {
        nodeToExplore = firstChild;
      } else {
        isLeaf = true;
      }
    }

    return nodeToExplore || null;
  }

  /**
   * Find the previous adjacent leaf in the tree. Returns null if a node has no
   * adjacent leaves. The following are examples of "previous adjacent leaf
   * nodes":
   *
   *           *
   *           |
   *      -----------
   *      |         |
   *    -----     -----
   *    |   |     |   |
   *   (A) (B)   (C) (D)
   *
   * - The previous adjacent leaf of (B) is (A)
   * - The previous adjacent leaf of (C) is (B)
   * - The previous adjacent leaf of (A) is (null)
   *
   * @throws { Error } If passing in a node that is not a leaf node.
   *
   * @throws { Error } If the "parentNode" static method is not implemented.
   *
   * @param { TNode } node - The leaf node to check for the previous adjacent.
   */
  static prevAdjacentLeaf(node: TNode): TNode | null {
    if (!this.isLeaf(node)) {
      throw Error('Expecting node to be a leaf node');
    }

    let parent = unimplThrows(this.parentNode(node));
    let child = node;

    let nodeToExplore = null;

    while (parent) {
      const childIter = IterUtils.iterFromIterable(this.childNodes(parent));

      let prevChild: ?TNode;
      try {
        prevChild = IterUtils.prevOf(childIter, child);
      } catch (_) {
        invariant(
          false,
          'parentNode and childNodes do not agree on structure of tree',
        );
      }

      if (prevChild) {
        // Found the desired child node to explore for a prev leaf.
        nodeToExplore = prevChild;
        break;
      }

      // The node has no next sibling. Need to search for the adjacent leaf
      // at the next parent.
      child = parent;
      parent = unimplThrows(this.parentNode(parent));
    }

    // We need to find the right-most leaf of the node to explore.
    let isLeaf = false;
    while (nodeToExplore && !isLeaf) {
      const childIter = IterUtils.iterFromIterable(
        this.childNodes(nodeToExplore),
      );
      const lastChild = IterUtils.last(childIter);
      if (lastChild) {
        nodeToExplore = lastChild;
      } else {
        isLeaf = true;
      }
    }

    return nodeToExplore || null;
  }

  /**
   * Create an iterable object for iterating through the descendants of a node
   * using an infix depth-first-search.
   *
   * @param { TNode } root - The root node to start the depth first search
   */
  static dfsInfixIterable(root: TNode): Iterable<TNode> {
    // $FlowFixMe - This is correct
    const iteratorFn: () => Iterator<TNode> = () => {
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

    return IterUtils.createIterable(iteratorFn);
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

const IterUtils = {
  createIterable<T>(iteratorFn: () => Iterator<T>): Iterable<T> {
    // $FlowFixMe - This is correct
    return { [Symbol.iterator]: iteratorFn };
  },

  iterFromIterable<T>(iterable: Iterable<T>): Iterator<T> {
    // $FlowFixMe - This is correct
    return iterable[Symbol.iterator]();
  },

  first<T>(iterator: Iterator<T>): ?T {
    const result = iterator.next();
    return result.done ? undefined : result.value;
  },

  last<T>(iterator: Iterator<T>): ?T {
    let result = iterator.next();
    let last = undefined;
    while (!result.done) {
      last = result.value;
      result = iterator.next();
    }
    return last;
  },

  iterateTo(iterator: Iterator<any>, item: any): boolean {
    let result = iterator.next();
    while (!result.done && result.value !== item) {
      result = iterator.next();
    }
    return result.value === item;
  },

  /**
   * Returns the previous item to a particular item, or undefined if there is
   * no previous item.
   *
   * @throws { Error } If the previous item does not exist in the list.
   */
  prevOf<T>(iterator: Iterator<T>, item: T): ?T {
    let prev = undefined;
    let result = iterator.next();
    while (!result.done && result.value !== item) {
      prev = result.value;
      result = iterator.next();
    }
    if (result.value === item) {
      return prev;
    }
    throw Error('Could not find item in the iterator');
  },
};
