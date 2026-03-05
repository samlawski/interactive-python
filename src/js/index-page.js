/* ===================================================================
   index-page.js — Entry point for the playground home page
   =================================================================== */

import '../css/style.css';

import { createEditor, getCode, setCode } from './editor.js';
import { Terminal } from './terminal.js';
import { initPyodide, runCode } from './python-runner.js';
import * as storage from './storage.js';

/* ------------------------------------------------------------------ */
/*  Bootstrap                                                          */
/* ------------------------------------------------------------------ */

const data = JSON.parse(
  document.getElementById('playground-data').textContent,
);

const STORAGE_ID = '__playground__';

const terminal = new Terminal(document.getElementById('terminal'));

/* Resolve starting code: saved → startCode → empty */
const initialCode =
  storage.getCode(STORAGE_ID) ?? data.startCode ?? '';

/* Build the editor */
let saveTimer = null;
const editor = createEditor(
  document.getElementById('editor'),
  initialCode,
  (code) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => storage.saveCode(STORAGE_ID, code), 400);
  },
);

/* ------------------------------------------------------------------ */
/*  Pyodide initialisation                                             */
/* ------------------------------------------------------------------ */

const loadingEl = document.getElementById('loading');
let pyodide = null;

initPyodide(data.basePath)
  .then((py) => {
    pyodide = py;
    loadingEl.classList.add('hidden');
    document.getElementById('run-btn').disabled = false;
    document.getElementById('reset-btn').disabled = false;
    document.getElementById('download-btn').disabled = false;
  })
  .catch((err) => {
    loadingEl.querySelector('p').textContent =
      'Failed to load Python — please refresh the page.';
    loadingEl.querySelector('.spinner')?.remove();
    console.error(err);
  });

/* ------------------------------------------------------------------ */
/*  Button handlers                                                    */
/* ------------------------------------------------------------------ */

const runBtn = document.getElementById('run-btn');

/* ▶ Run */
runBtn.addEventListener('click', async () => {
  runBtn.disabled = true;
  await runCode(pyodide, getCode(editor), terminal);
  runBtn.disabled = false;
});

/* Clear terminal */
document.getElementById('clear-btn').addEventListener('click', () => {
  terminal.clear();
});

/* ↺ Reset — show confirmation modal */
const resetModal = document.getElementById('reset-modal');

document.getElementById('reset-btn').addEventListener('click', () => {
  resetModal.classList.remove('hidden');
});

document.getElementById('reset-cancel').addEventListener('click', () => {
  resetModal.classList.add('hidden');
});

document.getElementById('reset-confirm').addEventListener('click', () => {
  resetModal.classList.add('hidden');
  storage.clearExercise(STORAGE_ID);
  setCode(editor, data.startCode ?? '');
  terminal.clear();
});

/* ⬇ Download */
document.getElementById('download-btn').addEventListener('click', () => {
  const code = getCode(editor);
  const blob = new Blob([code], { type: 'text/x-python' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'playground.py';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/* Close modal on backdrop click */
resetModal.addEventListener('click', (e) => {
  if (e.target === resetModal) resetModal.classList.add('hidden');
});
