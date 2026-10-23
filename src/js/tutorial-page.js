/* ===================================================================
   tutorial-page.js — Entry point for tutorial pages (notebooks)
   ===================================================================
   Markdown cells are pre-rendered by build.js. Each code cell
   placeholder (.nb-code) gets an editor, a Run button and an output
   area. All cells on a page share one Python namespace.
   =================================================================== */

import '../css/style.css';

import { createEditor, getCode, setCode } from './editor.js';
import { Terminal } from './terminal.js';
import { initPyodide, createNamespace, runCell } from './python-runner.js';
import * as storage from './storage.js';

initTutorial(JSON.parse(document.getElementById('tutorial-data').textContent));

function initTutorial(data) {
  const statusEl = document.getElementById('python-status');
  const restartBtn = document.getElementById('restart-btn');
  const cells = [];
  let pyodide = null;
  let namespace = null;
  let busy = false;

  /** Enable Run buttons only while Python is ready and idle. */
  function updateButtons() {
    for (const cell of cells) cell.runBtn.disabled = !pyodide || busy;
    restartBtn.disabled = !pyodide || busy;
  }

  async function run(cell) {
    if (!pyodide || busy) return;
    busy = true;
    updateButtons();
    cell.outputSection.hidden = false;

    try {
      await runCell(pyodide, getCode(cell.editor), cell.terminal, namespace);
    } catch (err) {
      cell.terminal.writeError('\n' + (err.message || String(err)) + '\n');
    } finally {
      busy = false;
      updateButtons();
    }
  }

  /* Build an editor + output area for every code cell */
  document.querySelectorAll('.nb-code').forEach((el) => {
    const { key, code, readOnly } = data.cells[Number(el.dataset.cell)];
    const storageId = `tutorial-${data.id}-${key}`;
    const cell = {};

    el.innerHTML = `
      <div class="editor-section card">
        <div class="editor-header">
          <span>${readOnly ? 'Example (read-only)' : 'Python'}</span>
          <span class="nb-actions">
            ${readOnly ? '' : '<button class="btn-small nb-reset" title="Restore the original code">↺ Reset</button>'}
            <button class="btn btn-primary nb-run" title="Run (Shift+Enter)" disabled>▶ Run</button>
          </span>
        </div>
        <div class="nb-editor"></div>
      </div>
      <div class="terminal-section card nb-output" hidden>
        <div class="terminal terminal-compact"></div>
      </div>`;

    const savedCode = readOnly ? null : storage.getCode(storageId);
    let saveTimer = null;
    cell.editor = createEditor(
      el.querySelector('.nb-editor'),
      savedCode ?? code,
      (newCode) => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => storage.saveCode(storageId, newCode), 400);
      },
      { readOnly, onRun: () => run(cell) },
    );
    cell.runBtn = el.querySelector('.nb-run');
    cell.outputSection = el.querySelector('.nb-output');
    cell.terminal = new Terminal(el.querySelector('.terminal'));

    cell.runBtn.addEventListener('click', () => run(cell));
    el.querySelector('.nb-reset')?.addEventListener('click', () => {
      clearTimeout(saveTimer);
      setCode(cell.editor, code);
      storage.clearCode(storageId);
    });

    cells.push(cell);
  });

  /* ↺ Restart: forget all variables, like restarting a Jupyter kernel */
  restartBtn.addEventListener('click', () => {
    if (!pyodide || busy) return;
    namespace.destroy();
    namespace = createNamespace(pyodide);
    for (const cell of cells) {
      cell.terminal.clear();
      cell.outputSection.hidden = true;
    }
    statusEl.textContent = '🟢 Python restarted. All variables were cleared.';
  });

  /* Load Python in the background; reading works right away */
  initPyodide(data.basePath)
    .then((py) => {
      pyodide = py;
      namespace = createNamespace(pyodide);
      statusEl.textContent = '🟢 Python is ready. Press ▶ Run or Shift+Enter in a code cell.';
      updateButtons();
    })
    .catch((err) => {
      statusEl.textContent = '🔴 Failed to load Python. Please refresh the page.';
      console.error(err);
    });
}
