import EditorNodeRefUtils from '../EditorNodeRefUtils';

import nullthrows from 'nullthrows';

import { Tree1, Tree2 } from '../TestEditorTrees';

test('getNode gets the node referenced from the root of the document', () => {
  const node = nullthrows(Tree1.childNodes[1].childNodes[0]);
  const ref = EditorNodeRefUtils.createRef(node);

  expect(EditorNodeRefUtils.getNode(Tree1, ref)).toBe(node);
});

test('getNode throws error when referenced node is not in the subtree', () => {
  const node = nullthrows(Tree1.childNodes[1].childNodes[0]);
  const ref = EditorNodeRefUtils.createRef(node);

  expect(() => EditorNodeRefUtils.getNode(Tree2, ref)).toThrow();
});

test('isEqual determines if two refs refer to the same node', () => {
  const node1 = nullthrows(Tree1.childNodes[1].childNodes[0]);
  const node2 = nullthrows(Tree1.childNodes[1]);

  const ref1 = EditorNodeRefUtils.createRef(node1);
  const ref2 = EditorNodeRefUtils.createRef(node1);
  const ref3 = EditorNodeRefUtils.createRef(node2);

  expect(EditorNodeRefUtils.isEqual(ref1, ref2)).toBe(true);
  expect(EditorNodeRefUtils.isEqual(ref1, ref3)).toBe(false);
});
