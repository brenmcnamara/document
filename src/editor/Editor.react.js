/* @flow */

import * as React from 'react';
import Keys from './Keys';

import invariant from 'invariant';

import type { EditorAction, RawHTML } from './types';

export type Props = {
  className?: string,
  inputSubject: rxjs$Subject<EditorAction>,
  outputObservable: rxjs$Observable<RawHTML>,
  placeholder?: string,
  placeholderClassName?: string,
  readOnly?: boolean,
};

// CORE COMPONENT RENDERED:
//   - https://github.com/facebook/draft-js/blob/master/src/component/base/DraftEditor.react.js#L365

export default class Editor extends React.Component<Props> {
  // TODO: Should make sure that the scroll position is maintained when
  // changing the focus. Look in draft-js component for guidance.
  focus(): void {}

  _editorRef: * = React.createRef();
  _outputSubscription: rxjs$Unsubscribable | null = null;

  onBeforeInput = this._onBeforeInput;
  onBlur = this._onBlur;
  onCompositionEnd = this._onCompositionEnd;
  onCompositionStart = this._onCompositionStart;
  onCopy = this._onCopy;
  onCut = this._onCut;
  onDragEnd = this._onDragEnd;
  onDragEnter = this._onDragEnter;
  onDragLeave = this._onDragLeave;
  onDragOver = this._onDragOver;
  onDragStart = this._onDragStart;
  onDrop = this._onDrop;
  onFocus = this._onFocus;
  onInput = this._onInput;
  onKeyDown = this._onKeyDown;
  onKeyPress = this._onKeyPress;
  onKeyUp = this._onKeyUp;
  onMouseDown = this._onMouseDown;
  onMouseUp = this._onMouseUp;
  onPaste = this._onPaste;
  onSelect = this._onSelect;

  _onOutputNext = (html: RawHTML): void => {
    this._editorRef.current.innerHTML = html;
  };

  // TODO: How do I type error?
  _onOutputError = (error: *): void => {
    throw error;
  };

  _onOutputComplete = (): void => {
    // TODO: Not sure what to do here...
  };

  _onBeforeInput = (event: SyntheticEvent<>): void => {};

  _onBlur = (event: SyntheticEvent<>): void => {};

  _onCompositionEnd = (event: SyntheticEvent<>): void => {};

  _onCompositionStart = (event: SyntheticEvent<>): void => {};

  _onCopy = (event: SyntheticEvent<>): void => {};

  _onCut = (event: SyntheticEvent<>): void => {};

  _onDragEnd = (event: SyntheticEvent<>): void => {};

  _onDragEnter = (event: SyntheticEvent<>): void => {};

  _onDragLeave = (event: SyntheticEvent<>): void => {};

  _onDragOver = (event: SyntheticEvent<>): void => {};

  _onDragStart = (event: SyntheticEvent<>): void => {};

  _onDrop = (event: SyntheticEvent<>): void => {};

  _onFocus = (event: SyntheticEvent<>): void => {};

  _onInput = (event: SyntheticEvent<>): void => {};

  _onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
    const { altKey, ctrlKey, metaKey, shiftKey, which: keyCode } = event;
    this.props.inputSubject.next({
      altKey,
      ctrlKey,
      keyCode,
      metaKey,
      shiftKey,
      type: 'ENTER_KEY',
    });
    event.preventDefault();
  };

  _onKeyPress = (event: SyntheticEvent<>): void => {};

  _onKeyUp = (event: SyntheticEvent<>): void => {};

  _onMouseDown = (event: SyntheticEvent<>): void => {};

  _onMouseUp = (event: SyntheticEvent<>): void => {};

  _onPaste = (event: SyntheticEvent<>): void => {};

  _onSelect = (event: SyntheticEvent<>): void => {};

  componentDidMount(): void {
    this._outputSubscription = this.props.outputObservable.subscribe(
      this._onOutputNext,
      this._onOutputError,
      this._onOutputComplete,
    );
  }

  componentWillUnmount(): void {
    this._outputSubscription && this._outputSubscription.unsubscribe();
  }

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
}
