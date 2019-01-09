/* @flow */

export type RawHTML = string;

// -----------------------------------------------------------------------------
//
// EDITOR ACTIONS
//
// -----------------------------------------------------------------------------

export type EditorAction = EditorAction$EnterKey;

export type EditorAction$EnterKey = {|
  +altKey: boolean,
  +ctrlKey: boolean,
  +keyCode: number,
  +metaKey: boolean,
  +shiftKey: boolean,
  +type: 'ENTER_KEY',
|};
