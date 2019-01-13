import EditorSelectionUtils from '../EditorSelectionUtils';

import { Tree1, Tree2 } from '../TestEditorTrees';

function getFirstLeaf(node) {
  if (node.childNodes.length === 0) {
    return node;
  }
  return getFirstLeaf(node.childNodes[0]);
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
