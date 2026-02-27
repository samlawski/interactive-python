/* ===================================================================
   exercise-page.js — Entry point for exercise pages
   =================================================================== */

import '../css/style.css';  /* Vite extracts this into a CSS asset */

import { createEditor, getCode, setCode } from './editor.js';
import { Terminal } from './terminal.js';
import { initPyodide, runCode, runTests } from './python-runner.js';
import * as storage from './storage.js';

/* ------------------------------------------------------------------ */
/*  Bootstrap                                                          */
/* ------------------------------------------------------------------ */

const data = JSON.parse(
  document.getElementById('exercise-data').textContent,
);

const terminal = new Terminal(document.getElementById('terminal'));

/* Resolve starting code: saved → startCode → empty */
const initialCode =
  storage.getCode(data.id) ?? data.startCode ?? '';

/* Build the editor */
let saveTimer = null;
const editor = createEditor(
  document.getElementById('editor'),
  initialCode,
  (code) => {
    /* Debounced auto-save on every keystroke */
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => storage.saveCode(data.id, code), 400);
  },
);

/* ------------------------------------------------------------------ */
/*  Back-to-assignment link                                            */
/* ------------------------------------------------------------------ */

const params = new URLSearchParams(window.location.search);
const fromAssignment = params.get('from');
const backLink = document.getElementById('back-link');

if (fromAssignment) {
  backLink.href = `../../assignments/${fromAssignment}/`;
  backLink.textContent = '← Back to Assignment';
  backLink.style.display = '';
}

/* ------------------------------------------------------------------ */
/*  Done status — restore on load                                      */
/* ------------------------------------------------------------------ */

const doneBtn = document.getElementById('done-btn');

function updateDoneBtn() {
  if (storage.isDone(data.id)) {
    doneBtn.textContent = '✓ Done';
    doneBtn.classList.add('btn-success');
  } else {
    doneBtn.textContent = '✓ Mark as Done';
    doneBtn.classList.remove('btn-success');
  }
}

updateDoneBtn();

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
    document.getElementById('test-btn').disabled = false;
    document.getElementById('reset-btn').disabled = false;
    doneBtn.disabled = false;
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
const testBtn = document.getElementById('test-btn');

function setRunning(busy) {
  runBtn.disabled = busy;
  testBtn.disabled = busy;
}

/* ▶ Run */
runBtn.addEventListener('click', async () => {
  setRunning(true);
  await runCode(pyodide, getCode(editor), terminal);
  setRunning(false);
});

/* 🧪 Test */
testBtn.addEventListener('click', async () => {
  if (!data.testCode) return;
  setRunning(true);
  terminal.clear();
  terminal.writeInfo('Running tests…\n\n');
  await runTests(pyodide, getCode(editor), data.testCode, terminal);
  setRunning(false);
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
  storage.clearExercise(data.id);
  setCode(editor, data.startCode ?? '');
  terminal.clear();
  updateDoneBtn();
});

/* ✓ Done */
doneBtn.addEventListener('click', () => {
  const nowDone = !storage.isDone(data.id);
  storage.setDone(data.id, nowDone);
  updateDoneBtn();

  /* Highlight the back-link if present */
  if (nowDone && backLink.style.display !== 'none' && fromAssignment) {
    backLink.classList.remove('highlight');
    /* Force reflow so re-adding the class restarts the animation */
    void backLink.offsetWidth;
    backLink.classList.add('highlight');
  }
});

/* Close modal on backdrop click */
resetModal.addEventListener('click', (e) => {
  if (e.target === resetModal) resetModal.classList.add('hidden');
});
