/* @flow */

import type { EditorSelection } from './EditorSelectionUtils';
import type { KeyPattern } from './KeyPatternUtils';

export type EditorAction =
  | EditorAction$Blur
  | EditorAction$ChangeSelection
  | EditorAction$EnterKeyPattern
  | EditorAction$Focus;

export type EditorAction$Blur = {|
  +type: 'BLUR',
|};

export type EditorAction$EnterKeyPattern = {|
  +pattern: KeyPattern,
  +type: 'ENTER_KEY_PATTERN',
|};

export type EditorAction$Focus = {|
  +type: 'FOCUS',
|};

export type EditorAction$ChangeSelection = {|
  +selection: EditorSelection | null,
  +type: 'CHANGE_SELECTION',
|};
