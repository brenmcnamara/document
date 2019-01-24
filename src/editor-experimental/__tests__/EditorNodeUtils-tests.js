import EditorNodeUtils from '../EditorNodeUtils';

import { Tree1, Tree1Copy, Tree2 } from '../TestEditorTrees';

test('validate throws no errors for valid documents', () => {
  EditorNodeUtils.validate(Tree1);
  EditorNodeUtils.validate(Tree2);
});

test('validate throws error if the document node has a parent', () => {
  const unexpectedParent = {
    childNodes: [],
    nodeName: 'doc',
    parentNode: null,
  };
  const doc = {
    childNodes: [],
    nodeName: 'doc',
    parentNode: unexpectedParent,
  };
  unexpectedParent.childNodes.push(doc);

  expect(() => EditorNodeUtils.validate(doc)).toThrow();
});

test('validate throws error if the document has a sub-tree that is also a document', () => {
  const rootDoc = {
    childNodes: [],
    nodeName: 'doc',
    parentNode: null,
  };
  const childDoc = {
    childNodes: [],
    nodeName: 'doc',
    parentNode: rootDoc,
  };
  rootDoc.childNodes.push(childDoc);

  expect(() => EditorNodeUtils.validate(rootDoc)).toThrow();
});

test('isEqual determines if two shallow editor nodes are equal', () => {
  const shallow1 = {
    childNodes: [],
    nodeName: 'text',
    parentNode: null,
    text: 'Hello World',
  };
  const shallow2 = {
    childNodes: [],
    nodeName: 'text',
    parentNode: null,
    text: 'Hello World',
  };
  const shallow3 = {
    childNodes: [],
    nodeName: 'text',
    parentNode: null,
    text: 'Hello World 2',
  };

  expect(EditorNodeUtils.isEqual(shallow1, shallow2)).toBe(true);
  expect(EditorNodeUtils.isEqual(shallow1, shallow3)).toBe(false);
});

test('isEqual determines if two composite editor nodes are equal', () => {
  expect(EditorNodeUtils.isEqual(Tree1, Tree1Copy)).toBe(true);
  expect(EditorNodeUtils.isEqual(Tree1, Tree2)).toBe(false);
});

test('cloneDocument creates a valid document', () => {
  const copy = EditorNodeUtils.cloneDocumentNode(Tree1);
  EditorNodeUtils.validate(copy);
});

test('cloneDocument creates a deep copy of the document', () => {
  const tree2Copy = EditorNodeUtils.cloneDocumentNode(Tree2);
  expect(tree2Copy).not.toBe(Tree2);
  expect(EditorNodeUtils.isEqual(tree2Copy, Tree2)).toBe(true);
});
