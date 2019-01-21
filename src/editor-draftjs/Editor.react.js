// HACK: We cannot provide type annotations for draft js at the moment. Draft
// JS is currently getting tons of flow errors. The reason is that draft-js
// depends on a much older version of flow, so we are currently waiting for the
// latest updates to get promoted to npm, which would resolve these flow errors.
// This can be followed here: https://github.com/facebook/draft-js/issues/1974

// Once the issue is fixed, must remember to update the .flowconfig to not
// ignore the draft-js module.

import {
  EditorState as DraftJSEditorState,
  Editor as DraftJSEditor,
} from 'draft-js';

export const Editor = DraftJSEditor;
export const EditorState = DraftJSEditorState;
