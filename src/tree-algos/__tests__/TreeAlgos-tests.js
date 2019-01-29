/* eslint-disable max-len */

import TreeAlgos from '../TreeAlgos';

class AlgosWithoutParentRef extends TreeAlgos {
  static childNodes(node) {
    return node.childNodes;
  }
}

class AlgosWithParentRef extends TreeAlgos {
  static childNodes(node) {
    return node.childNodes;
  }

  static parentNode(node) {
    return node.parentNode;
  }
}

function createNode(value: number) {
  return {
    withChildren(childNodes: Array<Object>) {
      const node = { childNodes, parentNode: null, value };
      for (let child of childNodes) {
        child.parentNode = node;
      }
      return node;
    },

    withParent(parentNode: Object | null) {
      const node = { childNodes: [], parentNode, value };
      if (parentNode) {
        parentNode.childNodes.push(node);
      }
      return node;
    },
  };
}

test('performs a depth-first-search of nodes from left to right', () => {
  const node = createNode(1).withChildren([
    createNode(2).withChildren([createNode(3).withChildren([])]),
    createNode(4).withChildren([
      createNode(5).withChildren([]),
      createNode(6).withChildren([createNode(7).withChildren([])]),
    ]),
  ]);

  const result = Array.from(AlgosWithoutParentRef.dfsInfixIterable(node));
  const values = result.map(node => node.value);
  expect(values).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test('finds node using predicate', () => {
  const node1 = createNode(1).withChildren([]);
  const node2 = createNode(2).withChildren([]);

  const root = createNode('a').withChildren([
    createNode('b').withChildren([]),
    createNode('c').withChildren([
      createNode('d').withChildren([
        node1,
        createNode('e').withChildren([node2]),
      ]),
    ]),
  ]);

  expect(AlgosWithoutParentRef.find(root, n => n.value === 1)).toBe(node1);
  expect(AlgosWithoutParentRef.find(root, n => n.value === 2)).toBe(node2);
});

test('find returns null when node could not be found', () => {
  const root = createNode('a').withChildren([]);
  expect(AlgosWithoutParentRef.find(root, val => val === 1)).toBe(null);
});

test('containsNode finds child node with parent reference', () => {
  const child = createNode(1).withChildren([]);
  const root = createNode('a').withChildren([
    createNode('b').withChildren([child]),
  ]);
  expect(AlgosWithParentRef.containsNode(root, child)).toBe(true);
});

test('containsNode find child node without parent reference', () => {
  const child = createNode(1).withChildren([]);
  const root = createNode('a').withChildren([
    createNode('b').withChildren([child]),
  ]);
  expect(AlgosWithoutParentRef.containsNode(root, child)).toBe(true);
});

test('containsNode determines node is not descendant with parent reference', () => {
  const child = createNode(1).withChildren([]);
  const root = createNode('a').withChildren([]);
  expect(AlgosWithParentRef.containsNode(root, child)).toBe(false);
});

test('containsNode determines node is not descendant without parent reference', () => {
  const child = createNode(1).withChildren([]);
  const root = createNode('a').withChildren([]);
  expect(AlgosWithoutParentRef.containsNode(root, child)).toBe(false);
});

test('containsNode is true if the parent and child nodes are the same', () => {
  const root = createNode('a').withChildren([]);
  expect(AlgosWithParentRef.containsNode(root, root)).toBe(true);
  expect(AlgosWithoutParentRef.containsNode(root, root)).toBe(true);
});

test('pathToChild returns an iterable that can go from the root to a descendant', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(child1);

  const path1 = Array.from(AlgosWithParentRef.pathToChild(root, child2));
  const path2 = Array.from(AlgosWithoutParentRef.pathToChild(root, child2));

  expect(path1).toEqual([root, child1, child2]);
  expect(path2).toEqual([root, child1, child2]);
});

test('pathToChild from a node to itself returns an iterable of 1 node', () => {
  const root = createNode('root').withParent(null);

  const path1 = Array.from(AlgosWithParentRef.pathToChild(root, root));
  const path2 = Array.from(AlgosWithoutParentRef.pathToChild(root, root));

  expect(path1).toEqual([root]);
  expect(path2).toEqual([root]);
});

test('pathToChild throws error when trying to find a path between 2 disconnected nodes', () => {
  const root1 = createNode('root1').withParent(null);
  const root2 = createNode('root2').withParent(null);

  expect(() =>
    Array.from(AlgosWithParentRef.pathToChild(root1, root2)),
  ).toThrow();
  expect(() =>
    Array.from(AlgosWithoutParentRef.pathToChild(root1, root2)),
  ).toThrow();
});

test('pathToChild throws error when trying to find a path from nodes that do not have direct path', () => {
  const root = createNode('root').withParent(null);
  const child = createNode('child').withParent(root);
  expect(() =>
    Array.from(AlgosWithParentRef.pathToChild(child, root)),
  ).toThrow();
  expect(() =>
    Array.from(AlgosWithoutParentRef.pathToChild(child, root)),
  ).toThrow();
});

test('pathToParent returns an iterable to the root of the tree', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(child1);

  const pathToRoot = Array.from(AlgosWithParentRef.pathToParent(child2));
  expect(pathToRoot).toEqual([child2, child1, root]);
});

test('pathToParent throws if no parentNode is provided', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(child1);

  expect(() =>
    Array.from(AlgosWithoutParentRef.pathToParent(child2)),
  ).toThrow();
});

test('pathToParent returns only root at the root node of a tree', () => {
  const root = createNode('root').withChildren([]);
  const pathToRoot = Array.from(AlgosWithParentRef.pathToParent(root));
  expect(pathToRoot).toEqual([root]);
});

test('leastCommonAncestor of a node and itself is itself', () => {
  const root = createNode('root').withChildren([]);

  expect(AlgosWithParentRef.leastCommonAncestor(root, root)).toBe(root);
});

test('leastCommonAncestor of a sub-tree and the root is the root', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(child1);

  expect(AlgosWithParentRef.leastCommonAncestor(child2, root)).toBe(root);
  expect(AlgosWithParentRef.leastCommonAncestor(root, child2)).toBe(root);
});

test('leastCommonAncestor of two sibling nodes is their parent', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);

  expect(AlgosWithParentRef.leastCommonAncestor(child1, child2)).toBe(root);
  expect(AlgosWithParentRef.leastCommonAncestor(child2, child1)).toBe(root);
});

test('leastCommonAncestor of two cousin nodes is their granparent', () => {
  const root = createNode('root').withParent(null);

  const child1 = createNode('child1').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);

  const child2 = createNode('child2').withParent(root);
  const child2_1 = createNode('child2_1').withParent(child2);

  // Cousins
  expect(AlgosWithParentRef.leastCommonAncestor(child1_1, child2_1)).toBe(root);
  expect(AlgosWithParentRef.leastCommonAncestor(child2_1, child1_1)).toBe(root);

  // Uncles / Aunts
  expect(AlgosWithParentRef.leastCommonAncestor(child1, child2_1)).toBe(root);
  expect(AlgosWithParentRef.leastCommonAncestor(child2_1, child1)).toBe(root);

  expect(AlgosWithParentRef.leastCommonAncestor(child1_1, child2)).toBe(root);
  expect(AlgosWithParentRef.leastCommonAncestor(child2, child1)).toBe(root);
});

test('leastCommonAncestor of two disconnected nodes is null', () => {
  const root1 = createNode('root1').withParent(null);
  const root2 = createNode('root2').withParent(null);

  expect(AlgosWithParentRef.leastCommonAncestor(root1, root2)).toBe(null);
  expect(AlgosWithParentRef.leastCommonAncestor(root2, root1)).toBe(null);
});

test('leastCommonAncestor throws when parentNode cannot be traversed', () => {
  const root = createNode('root').withParent(null);
  const child = createNode('child').withParent(root);

  expect(() =>
    AlgosWithoutParentRef.leastCommonAncestor(root, child),
  ).toThrow();
});

test('nextAdjacentLeaf returns the next leaf sibling if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);

  expect(AlgosWithParentRef.nextAdjacentLeaf(child1)).toBe(child2);
});

test('nextAdjacentLeaf returns the next leaf cousin if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);
  const child2_1 = createNode('child2_1').withParent(child2);

  expect(AlgosWithParentRef.nextAdjacentLeaf(child1_1)).toBe(child2_1);
});

test('nextAdjacentLeaf returns a niece / nephew leaf if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child2_1 = createNode('child2_1').withParent(child2);

  expect(AlgosWithParentRef.nextAdjacentLeaf(child1)).toBe(child2_1);
});

test('nextAdjacentLeaf returns an aunt / uncle leaf if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);

  expect(AlgosWithParentRef.nextAdjacentLeaf(child1_1)).toBe(child2);
});

test('nextAdjacentLeaf returns null if a node has no next adjacent', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);

  expect(AlgosWithParentRef.nextAdjacentLeaf(child1)).toBe(null);
});

test('nextAdjacentLeaf returns null for a single node with no parents or children', () => {
  const root = createNode('root').withParent(null);

  expect(AlgosWithParentRef.nextAdjacentLeaf(root)).toBe(null);
});

test('nextAdjacentLeaf throws error if querying for the next leaf of a non-leaf node', () => {
  const child1 = createNode('child1').withChildren([]);
  const root = createNode('root').withChildren([child1]);

  expect(() => AlgosWithParentRef.nextAdjacentLeaf(root)).toThrow();
});

test('nextAdjacentLeaf throws error if using TreeAlgos without a parentNode implementation', () => {
  const root = createNode('root').withParent(null);

  expect(() => AlgosWithoutParentRef.nextAdjacentLeaf(root)).toThrow();
});

test('prevAdjacentLeaf returns the next leaf sibling if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);

  expect(AlgosWithParentRef.prevAdjacentLeaf(child2)).toBe(child1);
});

test('prevAdjacentLeaf returns the next leaf cousin if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);
  const child2_1 = createNode('child2_1').withParent(child2);

  expect(AlgosWithParentRef.prevAdjacentLeaf(child2_1)).toBe(child1_1);
});

test('prevAdjacentLeaf returns a niece / nephew leaf if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);
  const child2 = createNode('child2').withParent(root);

  expect(AlgosWithParentRef.prevAdjacentLeaf(child2)).toBe(child1_1);
});

test('prevAdjacentLeaf returns an aunt / uncle leaf if one exists', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child2_1 = createNode('child2_1').withParent(child2);

  expect(AlgosWithParentRef.prevAdjacentLeaf(child2_1)).toBe(child1);
});

test('prevAdjacentLeaf returns null if a node has no next adjacent', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);

  expect(AlgosWithParentRef.prevAdjacentLeaf(child1)).toBe(null);
});

test('prevAdjacentLeaf returns null for a single node with no parents or children', () => {
  const root = createNode('root').withParent(null);

  expect(AlgosWithParentRef.prevAdjacentLeaf(root)).toBe(null);
});

test('prevAdjacentLeaf throws error if querying for the next leaf of a non-leaf node', () => {
  const child1 = createNode('child1').withChildren([]);
  const root = createNode('root').withChildren([child1]);

  expect(() => AlgosWithParentRef.prevAdjacentLeaf(root)).toThrow();
});

test('prevAdjacentLeaf throws error if using TreeAlgos without a parentNode implementation', () => {
  const root = createNode('root').withParent(null);

  expect(() => AlgosWithoutParentRef.nextAdjacentLeaf(root)).toThrow();
});

test('indexPathToNode returns an empty path when navigating from a node to itself', () => {
  const root = createNode('root').withParent(null);

  const path1 = Array.from(AlgosWithParentRef.indexPathToNode(root, root));
  expect(path1).toEqual([]);

  const path2 = Array.from(AlgosWithoutParentRef.indexPathToNode(root, root));
  expect(path2).toEqual([]);
});

test('indexPathToNode returns a path to a child node', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);
  const child2_1 = createNode('child2_1').withParent(child2);

  const path1 = Array.from(AlgosWithParentRef.indexPathToNode(root, child2_1));
  expect(path1).toEqual([1, 0]);

  const path2 = Array.from(AlgosWithParentRef.indexPathToNode(root, child1_1));
  expect(path2).toEqual([0, 0]);

  const path3 = Array.from(
    AlgosWithoutParentRef.indexPathToNode(root, child2_1),
  );
  expect(path3).toEqual([1, 0]);

  const path4 = Array.from(
    AlgosWithoutParentRef.indexPathToNode(root, child1_1),
  );
  expect(path4).toEqual([0, 0]);
});

test('indexPathToNode throws error when trying to find the path between disjoint nodes', () => {
  const root1 = createNode('root1').withParent(null);
  const root2 = createNode('root2').withParent(null);

  expect(() =>
    Array.from(AlgosWithParentRef.indexPathToNode(root1, root2)),
  ).toThrow();
  expect(() =>
    Array.from(AlgosWithoutParentRef.indexPathToNode(root1, root2)),
  ).toThrow();
});

test('indexPathToNode throws error when trying to find the path from child to parent', () => {
  const root = createNode('root').withParent(null);
  const child = createNode('child').withParent(root);

  expect(() =>
    Array.from(AlgosWithParentRef.indexPathToNode(child, root)),
  ).toThrow();
  expect(() =>
    Array.from(AlgosWithoutParentRef.indexPathToNode(child, root)),
  ).toThrow();
});

test('nodeAtIndexPath gets the root node when an empty index path is used', () => {
  const root = createNode('root').withParent(null);
  expect(AlgosWithParentRef.nodeAtIndexPath(root, [])).toBe(root);
});

test('nodeAtIndexPath gets the sub-node at an index path', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);
  const child2_1 = createNode('child2_1').withParent(child2);

  expect(AlgosWithParentRef.nodeAtIndexPath(root, [0, 0])).toBe(child1_1);
  expect(AlgosWithParentRef.nodeAtIndexPath(root, [1, 0])).toBe(child2_1);
});

test('nodeAtIndexPath throws error when passing an invalid index path', () => {
  const root = createNode('root').withParent(null);
  expect(() => AlgosWithParentRef.nodeAtIndexPath(root, [0])).toThrow();
});

test('leafIterable iterates the leaf nodes of a node', () => {
  const root = createNode('root').withParent(null);
  const child1 = createNode('child1').withParent(root);
  const child2 = createNode('child2').withParent(root);
  const child3 = createNode('child3').withParent(root);
  const child1_1 = createNode('child1_1').withParent(child1);
  const child1_2 = createNode('child1_2').withParent(child1);
  const child2_1 = createNode('child2_1').withParent(child2);
  const child2_2 = createNode('child2_2').withParent(child2);

  const leafNodes1 = Array.from(AlgosWithParentRef.leafIterable(root));
  expect(leafNodes1).toEqual([child1_1, child1_2, child2_1, child2_2, child3]);

  const leafNodes2 = Array.from(AlgosWithoutParentRef.leafIterable(root));
  expect(leafNodes2).toEqual([child1_1, child1_2, child2_1, child2_2, child3]);
});

test('leafIterable iterates a single node if it is a leaf node', () => {
  const root = createNode('root').withParent(null);

  const leafNodes1 = Array.from(AlgosWithParentRef.leafIterable(root));
  expect(leafNodes1).toEqual([root]);

  const leafNodes2 = Array.from(AlgosWithoutParentRef.leafIterable(root));
  expect(leafNodes2).toEqual([root]);
});
