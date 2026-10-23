/* ===================================================================
   editor.js — CodeMirror 6 wrapper
   =================================================================== */

import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState, Prec } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

/**
 * Create a CodeMirror editor inside the given element.
 *
 * @param {HTMLElement} parent   — the container element
 * @param {string}      code     — initial content
 * @param {function}    onChange  — called with the new doc string on every edit
 * @param {object}      [options]
 * @param {boolean}     [options.readOnly]  — prevent editing
 * @param {function}    [options.onRun]     — called on Shift+Enter
 * @returns {EditorView}
 */
export function createEditor(parent, code, onChange, { readOnly = false, onRun = null } = {}) {
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && onChange) {
      onChange(update.state.doc.toString());
    }
  });

  const extras = [];
  if (onRun) {
    extras.push(Prec.highest(keymap.of([
      { key: 'Shift-Enter', run: () => { onRun(); return true; } },
    ])));
  }
  if (readOnly) {
    extras.push(EditorState.readOnly.of(true), EditorView.editable.of(false));
  }

  const state = EditorState.create({
    doc: code,
    extensions: [
      ...extras,
      basicSetup,
      python(),
      oneDark,
      keymap.of([indentWithTab]),
      updateListener,
      EditorView.lineWrapping,
    ],
  });

  const view = new EditorView({ state, parent });
  return view;
}

/** Get current document text from an EditorView. */
export function getCode(view) {
  return view.state.doc.toString();
}

/** Replace the entire document content. */
export function setCode(view, code) {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: code },
  });
}
