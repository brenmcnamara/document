/* @flow */

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
   */
  static parentNode(node: TNode): OptionalImpl<TNode | null> {
    return '__NOT_IMPLEMENTED__';
  }

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

  static dfsInfixIterable(root: TNode): Iterable<TNode> {
    return {
      [Symbol.iterator]: () => {
        const stack = [root];
        return {
          next: () => {
            if (stack.length === 0) {
              return { done: true };
            }
            const node = stack.pop();
            stack.push.apply(
              stack,
              Array.from(this.childNodes(node)).reverse(),
            );
            return { done: false, value: node };
          },
        };
      },
    };
  }
}

function unimplThrows<T>(value: OptionalImpl<T>): T {
  if (value === '__NOT_IMPLEMENTED__') {
    throw Error('Expecting value to be implemented');
  }
  return value;
}
