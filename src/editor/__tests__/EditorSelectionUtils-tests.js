/* eslint-disable max-len */

import EditorNodeUtils from '../EditorNodeUtils';
import EditorSelectionUtils from '../EditorSelectionUtils';

import { Tree1, Tree2 } from '../TestEditorTrees';

function getFirstLeaf(node) {
  if (node.childNodes.length === 0) {
    return node;
  }
  return getFirstLeaf(node.childNodes[0]);
}

function getLastLeaf(node) {
  if (node.childNodes.length === 0) {
    return node;
  }
  return getLastLeaf(node.childNodes[node.childNodes.length - 1]);
}

test('validate does not throw error for valid selections', () => {
  const selection = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  EditorSelectionUtils.validate(selection);
});

test('validate throws error for selections of nodes in different trees', () => {
  const selection = {
    anchorNodeRef: Tree1,
    anchorOffset: 0,
    focusNodeRef: Tree2,
    focusOffset: 0,
  };
  expect(() => EditorSelectionUtils.validate(selection)).toThrow();
});

test('validate throws error for selections that have out-of-range offsets', () => {
  const selection = {
    anchorNodeRef: Tree1,
    anchorOffset: 0,
    focusNodeRef: Tree1,
    focusOffset: Tree1.childNodes.length + 1,
  };
  expect(() => EditorSelectionUtils.validate(selection)).toThrow();
});

test('isNorm detects if a selection is a norm', () => {
  const nonNormSelection = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const normSelection = {
    anchorNode: getFirstLeaf(Tree1),
    anchorOffset: 0,
    focusNode: getFirstLeaf(Tree1),
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isNorm(nonNormSelection)).toBe(false);
  expect(EditorSelectionUtils.isNorm(normSelection)).toBe(true);
});

test('sNorm detects if a non-norm selection of leaf nodes is a norm', () => {
  const leaf = getFirstLeaf(Tree1);
  const selection = {
    anchorNode: leaf,
    anchorOffset: 0,
    focusNode: leaf,
    focusOffset: leaf.text.length + 1,
  };
  expect(EditorSelectionUtils.isNorm(selection)).toBe(false);
});

test('norm normalizes a selection', () => {
  const leaf = getFirstLeaf(Tree1);
  const selection = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const normSelection = {
    anchorNode: leaf,
    anchorOffset: 0,
    focusNode: leaf,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.norm(selection)).toEqual(normSelection);
});

test('norm returns the same selection if it is already normalized', () => {
  const leaf = getFirstLeaf(Tree1);
  const selection = {
    anchorNode: leaf,
    anchorOffset: 0,
    focusNode: leaf,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.norm(selection)).toBe(selection);
});

test('norm normalizes a selection that has an offset equal to length of children', () => {
  const node = Tree1.childNodes[0];
  const selection = {
    anchorNode: node,
    anchorOffset: 0,
    focusNode: node,
    focusOffset: node.childNodes.length,
  };

  const normAnchorNode = getFirstLeaf(node);
  const normFocusNode = getFirstLeaf(Tree1.childNodes[1]);
  const normSelection = {
    anchorNode: normAnchorNode,
    anchorOffset: 0,
    focusNode: normFocusNode,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.norm(selection)).toEqual(normSelection);
});

test('norm sets the offset to the length of leaf when the node being referenced is the last leaf in the document', () => {
  const selection = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: Tree1.childNodes.length,
  };
  const firstLeaf = getFirstLeaf(Tree1);
  const lastLeaf = getLastLeaf(Tree1);
  const normSelection = {
    anchorNode: firstLeaf,
    anchorOffset: 0,
    focusNode: lastLeaf,
    focusOffset: lastLeaf.text.length,
  };
  expect(EditorSelectionUtils.norm(selection)).toEqual(normSelection);
});

test('norm normalizes a non-normalized selection with leaf anchor and focus', () => {
  const leaf = getFirstLeaf(Tree1);
  const nextLeaf = EditorNodeUtils.nextAdjacentLeaf(leaf);

  const selection1 = {
    anchorNode: leaf,
    anchorOffset: 0,
    focusNode: leaf,
    focusOffset: leaf.text.length,
  };
  const normSelection1 = {
    anchorNode: leaf,
    anchorOffset: 0,
    focusNode: nextLeaf,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.norm(selection1)).toEqual(normSelection1);

  const selection2 = {
    anchorNode: leaf,
    anchorOffset: leaf.text.length,
    focusNode: leaf,
    focusOffset: 0,
  };
  const normSelection2 = {
    anchorNode: nextLeaf,
    anchorOffset: 0,
    focusNode: leaf,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.norm(selection2)).toEqual(normSelection2);
});

test('isEqual returns true for selection with the same node and offset', () => {
  const selection1 = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const selection2 = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isEqual(selection1, selection2)).toBe(true);
});

test('isEqual returns false for different selections', () => {
  const selection1 = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const selection2 = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 1,
  };
  expect(EditorSelectionUtils.isEqual(selection1, selection2)).toBe(false);
});

test('isEqual returns true for a selection and its norm', () => {
  const collapsed = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const normCollapsed = EditorSelectionUtils.norm(collapsed);
  expect(EditorSelectionUtils.isEqual(collapsed, normCollapsed)).toBe(true);

  const partial = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 1,
  };
  const normPartial = EditorSelectionUtils.norm(partial);
  expect(EditorSelectionUtils.isEqual(partial, normPartial)).toBe(true);

  const all = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: Tree1.childNodes.length,
  };
  const normAll = EditorSelectionUtils.norm(all);
  expect(EditorSelectionUtils.isEqual(all, normAll)).toBe(true);
});

test('isCollapsed returns true for normalized, collapsed selections', () => {
  const leaf = getFirstLeaf(Tree1);
  const selection = {
    anchorNode: leaf,
    anchorOffset: 1,
    focusNode: leaf,
    focusOffset: 1,
  };
  expect(EditorSelectionUtils.isCollapsed(selection)).toBe(true);
});

test('isCollapsed returns false for normalized, non-collapsed selections', () => {
  const leaf = getFirstLeaf(Tree1);
  const selection = {
    anchorNode: leaf,
    anchorOffset: 0,
    focusNode: leaf,
    focusOffset: 1,
  };
  expect(EditorSelectionUtils.isCollapsed(selection)).toBe(false);
});

test('isCollapsed returns true for non-normalized, collapsed selections', () => {
  const selection = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isCollapsed(selection)).toBe(true);
});

test('isCollapsed returns false for non-normalized, non-collapsed selections', () => {
  const selection = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 1,
  };
  expect(EditorSelectionUtils.isCollapsed(selection)).toBe(false);
});

test('isCollapsed returns true for collapsed selections where the cursor is at the end of the doc', () => {
  const selection = {
    anchorNode: Tree1,
    anchorOffset: Tree1.childNodes.length,
    focusNode: Tree1,
    focusOffset: Tree1.childNodes.length,
  };
  expect(EditorSelectionUtils.isCollapsed(selection)).toBe(true);
});

test('collapse collapses selection to the focus', () => {
  const original = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 1,
  };
  const collapsed = EditorSelectionUtils.collapse(original, 'to-focus');
  const expected = {
    anchorNode: Tree1,
    anchorOffset: 1,
    focusNode: Tree1,
    focusOffset: 1,
  };
  expect(EditorSelectionUtils.isEqual(collapsed, expected)).toBe(true);
});

test('collapse collapses backward selections to the focus', () => {
  const original = {
    anchorNode: Tree1,
    anchorOffset: 1,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const collapsed = EditorSelectionUtils.collapse(original, 'to-focus');
  const expected = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isEqual(collapsed, expected)).toBe(true);
});

test('collapse collapses selection to the anchor', () => {
  const original = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 1,
  };
  const collapsed = EditorSelectionUtils.collapse(original, 'to-anchor');
  const expected = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isEqual(collapsed, expected)).toBe(true);
});

test('collapse collapses backward selections to the anchor', () => {
  const original = {
    anchorNode: Tree1,
    anchorOffset: 1,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const collapsed = EditorSelectionUtils.collapse(original, 'to-anchor');
  const expected = {
    anchorNode: Tree1,
    anchorOffset: 1,
    focusNode: Tree1,
    focusOffset: 1,
  };
  expect(EditorSelectionUtils.isEqual(collapsed, expected)).toBe(true);
});

test('collapse collapses selection to the end of the document', () => {
  const original = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: Tree1.childNodes.length,
  };
  const collapsed = EditorSelectionUtils.collapse(original, 'to-focus');
  const expected = {
    anchorNode: Tree1,
    anchorOffset: Tree1.childNodes.length,
    focusNode: Tree1,
    focusOffset: Tree1.childNodes.length,
  };
  expect(EditorSelectionUtils.isEqual(collapsed, expected)).toBe(true);
});

test('collapse collapses backwards selection to the end of the document', () => {
  const original = {
    anchorNode: Tree1,
    anchorOffset: Tree1.childNodes.length,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const collapsed = EditorSelectionUtils.collapse(original, 'to-anchor');
  const expected = {
    anchorNode: Tree1,
    anchorOffset: Tree1.childNodes.length,
    focusNode: Tree1,
    focusOffset: Tree1.childNodes.length,
  };
  expect(EditorSelectionUtils.isEqual(collapsed, expected)).toBe(true);
});

test('isBackward works with anchor and focus being the same node', () => {
  const forward = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 1,
  };
  const backward = {
    anchorNode: Tree2,
    anchorOffset: 1,
    focusNode: Tree2,
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isBackward(forward)).toBe(false);
  expect(EditorSelectionUtils.isBackward(backward)).toBe(true);
});

test('isBackward works with anchor and focus being sibling nodes', () => {
  const forward = {
    anchorNode: Tree1.childNodes[0],
    anchorOffset: 0,
    focusNode: Tree1.childNodes[1],
    focusOffset: 0,
  };
  const backward = {
    anchorNode: Tree1.childNodes[1],
    anchorOffset: 0,
    focusNode: Tree1.childNodes[0],
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isBackward(forward)).toBe(false);
  expect(EditorSelectionUtils.isBackward(backward)).toBe(true);
});

test('isBackward works with anchor and focus being at different depths of the tree', () => {
  const forward = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: getLastLeaf(Tree1),
    focusOffset: 0,
  };
  const backward = {
    anchorNode: Tree1,
    anchorOffset: 1,
    focusNode: getFirstLeaf(Tree1),
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isBackward(forward)).toBe(false);
  expect(EditorSelectionUtils.isBackward(backward)).toBe(true);
});

test('isBackward is false for collapsed selections', () => {
  const collapsed1 = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: Tree1,
    focusOffset: 0,
  };
  const collapsed2 = {
    anchorNode: Tree1,
    anchorOffset: 0,
    focusNode: getFirstLeaf(Tree1),
    focusOffset: 0,
  };
  expect(EditorSelectionUtils.isBackward(collapsed1)).toBe(false);
  expect(EditorSelectionUtils.isBackward(collapsed2)).toBe(false);
});
