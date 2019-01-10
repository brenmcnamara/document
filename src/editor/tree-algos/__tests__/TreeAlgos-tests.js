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

test('pathToRoot returns an iterable to the root of the tree', () => {
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
