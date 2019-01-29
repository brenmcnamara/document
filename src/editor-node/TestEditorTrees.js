/* @flow */

import type { DocumentEditorNode } from '../editor-node/EditorNodeUtils';

function createTree1(): DocumentEditorNode {
  // Create the nodes.
  const root = { childNodes: [], id: '1', nodeName: 'doc', parentNode: null };

  const h1 = { childNodes: [], id: '2', nodeName: 'h1', parentNode: root };
  const h1_text = {
    childNodes: [],
    id: '3',
    nodeName: 'text',
    parentNode: h1,
    text: 'Header 1',
  };

  const h2 = { childNodes: [], id: '4', nodeName: 'h2', parentNode: root };
  const h2_text = {
    childNodes: [],
    id: '5',
    nodeName: 'text',
    parentNode: h2,
    text: 'Header 2',
  };

  const p = { childNodes: [], id: '6', nodeName: 'p', parentNode: root };
  const p_text = {
    childNodes: [],
    id: '7',
    nodeName: 'text',
    parentNode: p,
    text: 'paragraph',
  };

  // Connect the nodes properly
  root.childNodes.push(h1, h2, p);
  h1.childNodes.push(h1_text);
  h2.childNodes.push(h2_text);
  p.childNodes.push(p_text);

  return root;
}

function createTree2(): DocumentEditorNode {
  // Create the nodes
  const root = { childNodes: [], id: '1', nodeName: 'doc', parentNode: null };
  const h1 = { childNodes: [], id: '2', nodeName: 'h1', parentNode: root };
  const h1_text = {
    childNodes: [],
    id: '3',
    nodeName: 'text',
    parentNode: h1,
    text: 'Header',
  };

  // Connect the nodes properly
  root.childNodes.push(h1);
  h1.childNodes.push(h1_text);

  return root;
}

export const Tree1 = createTree1();
export const Tree1Copy = createTree1();

export const Tree2 = createTree2();
export const Tree2Copy = createTree2();
