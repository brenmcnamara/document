/* @flow */

import * as React from 'react';
import EditorContentUtils from './EditorContentUtils';
import EditorSelectionUtils from './EditorSelectionUtils';
import Keys from './Keys';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import { Observable } from 'rxjs';

import type { EditorAction } from './EditorActionUtils';
import type { EditorContent } from './EditorContentUtils';
import type { EditorSelection } from './EditorSelectionUtils';

export type EditorInput = rxjs$Observable<EditorAction>;
export type EditorOutput = rxjs$Observable<EditorContent>;

export type Props = {
  className?: string,
  onInputReady: (input: EditorInput) => EditorOutput,
  readOnly?: boolean,
};

// CORE COMPONENT RENDERED:
//   - https://github.com/facebook/draft-js/blob/master/src/component/base/DraftEditor.react.js#L365

export default class Editor extends React.Component<Props> {
  _editorContent: EditorContent = EditorContentUtils.createEmptyContent();
  _editorRef: * = React.createRef();
  _input: EditorInput;
  _inputObserver: rxjs$Observer<EditorAction> | null = null;
  _outputSubscription: rxjs$Unsubscribable | null = null;

  // ---------------------------------------------------------------------------
  //
  // OUTPUT EVENTS
  //
  // ---------------------------------------------------------------------------

  _onOutputNext = (content: EditorContent): void => {};

  _onOutputError = (error: any): void => {
    throw error;
  };

  _onOutputComplete = (): void => {
    throw Error('Editor outputObservable should never be complete');
  };

  // ---------------------------------------------------------------------------
  //
  // EDITOR EVENTS
  //
  // ---------------------------------------------------------------------------

  _onBeforeInput = null;

  _onBlur = (event: SyntheticEvent<>): void => {
    this._inputObserver && this._inputObserver.next({ type: 'BLUR' });
  };

  _onCompositionEnd = null;

  _onCompositionStart = null;

  _onCopy = null;

  _onCut = null;

  _onDragEnd = null;

  _onDragEnter = null;

  _onDragLeave = null;

  _onDragOver = null;

  _onDragStart = null;

  _onDrop = null;

  _onFocus = (event: SyntheticFocusEvent<>): void => {
    this._inputObserver && this._inputObserver.next({ type: 'FOCUS' });
  };

  _onInput = null;

  _onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
    const pattern = {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      keyCode: event.which,
      metaKey: event.metaKey,
      shiftKey: event.metaKey,
    };
    this._inputObserver &&
      this._inputObserver.next({ pattern, type: 'ENTER_KEY_PATTERN' });
    event.preventDefault();
  };

  _onKeyPress = null;

  _onKeyUp = null;

  _onMouseDown = null;

  _onMouseUp = null;

  _onPaste = null;

  _onSelect = (event: SyntheticEvent<>): void => {
    // TODO: Implement me!
  };

  // ---------------------------------------------------------------------------
  //
  // LIFECYCLE
  //
  // ---------------------------------------------------------------------------

  componentWillMount(): void {
    const output = this.props.onInputReady(this._input);
    this._outputSubscription = output.subscribe({
      onNext: this._onOutputNext,
      onError: this._onOutputError,
      onComplete: this._onOutputComplete,
    });
  }

  componentDidMount(): void {}

  componentWillUnmount(): void {
    this._outputSubscription && this._outputSubscription.unsubscribe();
  }

  // ---------------------------------------------------------------------------
  //
  // RENDER
  //
  // ---------------------------------------------------------------------------

  render() {
    return (
      <div
        className={this.props.className}
        contentEditable={!this.props.readOnly}
        onBeforeInput={this._onBeforeInput}
        onBlur={this._onBlur}
        onCompositionEnd={this._onCompositionEnd}
        onCompositionStart={this._onCompositionStart}
        onCopy={this._onCopy}
        onCut={this._onCut}
        onDragEnd={this._onDragEnd}
        onDragEnter={this._onDragEnter}
        onDragLeave={this._onDragLeave}
        onDragOver={this._onDragOver}
        onDragStart={this._onDragStart}
        onDrop={this._onDrop}
        onFocus={this._onFocus}
        onInput={this._onInput}
        onKeyDown={this._onKeyDown}
        onKeyPress={this._onKeyPress}
        onKeyUp={this._onKeyUp}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        onPaste={this._onPaste}
        onSelect={this._onSelect}
        ref={this._editorRef}
      />
    );
  }

  _setContent(content: EditorContent): void {}

  _hasFocus(): boolean {
    return Boolean(
      this._editorRef.current &&
        document.activeElement === this._editorRef.current,
    );
  }
}
