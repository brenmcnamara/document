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
