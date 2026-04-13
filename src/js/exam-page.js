/* ===================================================================
   exam-page.js — Entry point for exam pages
   ===================================================================
   Features:
   - Renders exam tasks with textareas or code editors
   - Code blocks rendered as canvas images (unselectable)
   - Independent editor/terminal pairs per task
   - Download answers as Markdown
   - localStorage persistence
   - Copy/paste protection
   - Service worker registration for offline support
   =================================================================== */

import '../css/style.css';

import { createEditor, getCode } from './editor.js';
import { Terminal } from './terminal.js';
import { initPyodide, runCode } from './python-runner.js';

/* ------------------------------------------------------------------ */
/*  Bootstrap                                                          */
/* ------------------------------------------------------------------ */

const data = JSON.parse(
  document.getElementById('exam-data').textContent,
);

const editors = {};   /* taskId → EditorView */
const terminals = {}; /* taskId → Terminal   */
let pyodide = null;

/* ------------------------------------------------------------------ */
/*  Shuffle task order, then enhance                                   */
/* ------------------------------------------------------------------ */

/* Shuffle first — before creating editors — so DOM manipulation
   cannot disrupt CodeMirror state or debounced localStorage saves. */
const examContainer = document.getElementById('exam-tasks');
const taskEls = Array.from(examContainer.querySelectorAll('.exam-task'));

for (let i = taskEls.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [taskEls[i], taskEls[j]] = [taskEls[j], taskEls[i]];
}

/* Remove old separators, re-append tasks in shuffled order */
examContainer.querySelectorAll('.task-separator').forEach((hr) => hr.remove());
taskEls.forEach((task, i) => {
  if (i > 0) {
    const hr = document.createElement('hr');
    hr.className = 'task-separator';
    examContainer.appendChild(hr);
  }
  examContainer.appendChild(task);
});

/* Now enhance each task (editors, textareas, canvas code blocks) */
taskEls.forEach((taskEl) => {
  const taskId = taskEl.dataset.taskId;
  const hasEditor = taskEl.dataset.hasEditor === 'true';

  /* Convert code blocks to canvas images (unselectable) */
  taskEl.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('code')) {
      renderCodeAsCanvas(pre);
    }
  });

  const answerArea = taskEl.querySelector('.task-answer-area');

  if (hasEditor) {
    buildEditorTerminal(answerArea, taskId);
  } else {
    buildTextarea(answerArea, taskId);
  }
});

/* ------------------------------------------------------------------ */
/*  Spotlight — button-based task navigation                           */
/* ------------------------------------------------------------------ */

const ACTIVE_TASK_KEY = `exam-${data.id}-active-task`;

function goToTask(index) {
  for (let i = 0; i < taskEls.length; i++) {
    taskEls[i].classList.toggle('task-focused', i === index);
  }
  localStorage.setItem(ACTIVE_TASK_KEY, index);
  taskEls[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

if (taskEls.length >= 2) {
  examContainer.classList.add('spotlight-active');

  taskEls.forEach((el, i) => {
    const nav = document.createElement('div');
    nav.className = 'task-nav';

    if (i > 0) {
      const prev = document.createElement('button');
      prev.className = 'btn btn-nav';
      prev.textContent = '← Previous Task';
      prev.addEventListener('click', () => goToTask(i - 1));
      nav.appendChild(prev);
    }

    if (i < taskEls.length - 1) {
      const next = document.createElement('button');
      next.className = 'btn btn-nav';
      next.textContent = 'Next Task →';
      next.addEventListener('click', () => goToTask(i + 1));
      nav.appendChild(next);
    }

    el.appendChild(nav);
  });

  const saved = parseInt(localStorage.getItem(ACTIVE_TASK_KEY), 10);
  const start = saved >= 0 && saved < taskEls.length ? saved : 0;
  goToTask(start);
}

/* ------------------------------------------------------------------ */
/*  Textarea builder                                                   */
/* ------------------------------------------------------------------ */

function buildTextarea(container, taskId) {
  const textarea = document.createElement('textarea');
  textarea.className = 'exam-textarea';
  textarea.rows = 3;
  textarea.placeholder = 'Enter your answer here…';

  /* Restore from localStorage */
  const saved = localStorage.getItem(`exam-${data.id}-${taskId}`);
  if (saved) textarea.value = saved;

  /* Auto-save on input */
  textarea.addEventListener('input', () => {
    localStorage.setItem(`exam-${data.id}-${taskId}`, textarea.value);
    autoExpand(textarea);
  });

  /* Paste protection */
  textarea.addEventListener('paste', (e) => {
    e.preventDefault();
    showWarning('paste');
  });

  container.appendChild(textarea);
  autoExpand(textarea);
}

function autoExpand(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

/* ------------------------------------------------------------------ */
/*  Editor + Terminal builder                                          */
/* ------------------------------------------------------------------ */

function buildEditorTerminal(container, taskId) {
  /* Editor section */
  const editorSection = document.createElement('div');
  editorSection.className = 'editor-section card exam-editor';

  const editorHeader = document.createElement('div');
  editorHeader.className = 'editor-header';
  editorHeader.innerHTML = '<span>solution.py</span>';
  editorSection.appendChild(editorHeader);

  const editorDiv = document.createElement('div');
  editorSection.appendChild(editorDiv);
  container.appendChild(editorSection);

  /* Controls */
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.innerHTML = `
    <div class="controls-left">
      <button class="btn btn-primary run-btn" data-task="${taskId}" disabled>▶ Run</button>
    </div>
  `;
  container.appendChild(controls);

  /* Terminal section */
  const termSection = document.createElement('div');
  termSection.className = 'terminal-section card';

  const termHeader = document.createElement('div');
  termHeader.className = 'terminal-header';
  termHeader.innerHTML = `<span>Output</span><button class="btn-small clear-btn" data-task="${taskId}">Clear</button>`;
  termSection.appendChild(termHeader);

  const termDiv = document.createElement('div');
  termDiv.className = 'terminal';
  termDiv.innerHTML = '<span class="muted">Click ▶ Run to execute your code.</span>';
  termSection.appendChild(termDiv);
  container.appendChild(termSection);

  /* Create CodeMirror editor */
  const savedCode =
    localStorage.getItem(`exam-${data.id}-editor-${taskId}`) || '';

  let saveTimer = null;
  const editor = createEditor(editorDiv, savedCode, (code) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(
      () => localStorage.setItem(`exam-${data.id}-editor-${taskId}`, code),
      400,
    );
  });

  editors[taskId] = editor;
  terminals[taskId] = new Terminal(termDiv);

  /* Paste protection on editor (capture phase) */
  editorDiv.addEventListener(
    'paste',
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      showWarning('paste');
    },
    true,
  );

  editorDiv.addEventListener(
    'beforeinput',
    (e) => {
      if (e.inputType === 'insertFromPaste') {
        e.preventDefault();
        showWarning('paste');
      }
    },
    true,
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas rendering for code blocks                                   */
/* ------------------------------------------------------------------ */

function renderCodeAsCanvas(preElement) {
  const code = preElement.textContent;
  const lines = code.split('\n');
  if (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const fontSize = 14;
  const lineHeight = fontSize * 1.6;
  const padding = 16;
  const font = `${fontSize}px 'Courier New', Courier, monospace`;

  ctx.font = font;

  let maxWidth = 0;
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    if (w > maxWidth) maxWidth = w;
  }

  const width = Math.max(maxWidth + padding * 2, 200);
  const height = lines.length * lineHeight + padding * 2;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = '100%';
  canvas.style.maxWidth = width + 'px';
  canvas.style.height = 'auto';
  canvas.style.display = 'block';
  canvas.style.borderRadius = 'var(--radius, 8px)';
  canvas.style.margin = '0.75rem 0';

  ctx.scale(dpr, dpr);

  /* Background (rounded rect) */
  roundRect(ctx, 0, 0, width, height, 8);
  ctx.fillStyle = '#1e293b';
  ctx.fill();

  /* Code text */
  ctx.font = font;
  ctx.fillStyle = '#e2e8f0';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    ctx.fillText(line, padding, padding + i * lineHeight);
  });

  preElement.replaceWith(canvas);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ------------------------------------------------------------------ */
/*  Copy protection                                                    */
/* ------------------------------------------------------------------ */

document.addEventListener('copy', (e) => {
  e.preventDefault();
  if (e.clipboardData) e.clipboardData.setData('text/plain', '');
  showWarning('copy');
});

/* ------------------------------------------------------------------ */
/*  Warning modal                                                      */
/* ------------------------------------------------------------------ */

const warningModal = document.getElementById('warning-modal');
const warningTitle = document.getElementById('warning-title');
const warningMessage = document.getElementById('warning-message');

/** Check whether any modal backdrop is currently visible. */
function isAnyModalOpen() {
  return document.querySelectorAll('.modal-backdrop:not(.hidden)').length > 0;
}

function showWarning(type) {
  if (type === 'copy') {
    warningTitle.textContent = '⚠️ Copy Not Allowed';
    warningMessage.textContent =
      'There is no need to copy content from this page.';
  } else {
    warningTitle.textContent = '⚠️ Paste Not Allowed';
    warningMessage.textContent =
      'You are not permitted to enter content from external sources.';
  }
  warningModal.classList.remove('hidden');
}

document.getElementById('warning-close').addEventListener('click', () => {
  warningModal.classList.add('hidden');
});

warningModal.addEventListener('click', (e) => {
  if (e.target === warningModal) warningModal.classList.add('hidden');
});

/* ------------------------------------------------------------------ */
/*  Download answers as Markdown                                       */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Email prompt for download                                          */
/* ------------------------------------------------------------------ */

const emailModal = document.getElementById('email-modal');
const emailInput = document.getElementById('email-input');

/* Restore previously entered email */
const savedEmail = localStorage.getItem(`exam-${data.id}-email`);
if (savedEmail) emailInput.value = savedEmail;

function promptAndDownload() {
  emailModal.classList.remove('hidden');
  emailInput.focus();
}

document.getElementById('email-cancel').addEventListener('click', () => {
  emailModal.classList.add('hidden');
});

emailModal.addEventListener('click', (e) => {
  if (e.target === emailModal) emailModal.classList.add('hidden');
});

document.getElementById('email-confirm').addEventListener('click', () => {
  const email = emailInput.value.trim();
  if (!email) {
    emailInput.focus();
    return;
  }
  localStorage.setItem(`exam-${data.id}-email`, email);
  emailModal.classList.add('hidden');
  downloadAnswers(email);
});

/* Allow Enter to confirm */
emailInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('email-confirm').click();
  }
});

/* ------------------------------------------------------------------ */
/*  Global keyboard handler for modals                                 */
/* ------------------------------------------------------------------ */

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' && e.key !== 'Enter') return;

  /* Warning modal: Enter or Escape closes */
  if (!warningModal.classList.contains('hidden')) {
    warningModal.classList.add('hidden');
    return;
  }

  /* Focus modal: Enter or Escape closes */
  if (!focusModal.classList.contains('hidden')) {
    focusModal.classList.add('hidden');
    return;
  }

  /* Email modal: Escape closes without action */
  if (!emailModal.classList.contains('hidden')) {
    if (e.key === 'Escape') {
      emailModal.classList.add('hidden');
    }
    /* Enter is already handled by the emailInput keydown listener */
    return;
  }
});

function downloadAnswers(email) {
  let md = `# ${data.title}\n\n`;
  md += `**Email:** ${email}\n\n`;
  md += `**Downloaded:** ${new Date().toISOString()}\n\n`;
  md += `**Device:** ${navigator.userAgent}\n\n`;
  md += '---\n\n';

  for (const task of data.tasks) {
    md += `## ${task.title}\n\n`;

    if (task.hasEditor) {
      const code = editors[task.id]
        ? getCode(editors[task.id])
        : localStorage.getItem(`exam-${data.id}-editor-${task.id}`) || '';
      if (code.trim()) {
        md += '```python\n' + code + '\n```\n\n';
      } else {
        md += '*No answer provided.*\n\n';
      }
    } else {
      const answer =
        localStorage.getItem(`exam-${data.id}-${task.id}`) || '';
      md += (answer.trim() || '*No answer provided.*') + '\n\n';
    }

    md += '---\n\n';
  }

  /* Sanitise email for filename */
  const safeEmail = email.replace(/[^a-zA-Z0-9@._-]/g, '_');

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.id}-${safeEmail}.md`;
  document.body.appendChild(a);
  suppressFocusModal(5000); /* download dialog steals focus */
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document
  .getElementById('download-top-btn')
  .addEventListener('click', promptAndDownload);
document
  .getElementById('download-bottom-btn')
  .addEventListener('click', promptAndDownload);

/* ------------------------------------------------------------------ */
/*  Pyodide — loaded only when exam has code editors                   */
/* ------------------------------------------------------------------ */

const hasEditors = data.tasks.some((t) => t.hasEditor);

if (hasEditors) {
  const loadingEl = document.getElementById('loading');
  loadingEl.classList.remove('hidden');

  initPyodide(data.basePath)
    .then((py) => {
      pyodide = py;
      loadingEl.classList.add('hidden');
      document
        .querySelectorAll('.run-btn')
        .forEach((btn) => (btn.disabled = false));
    })
    .catch((err) => {
      loadingEl.querySelector('p').textContent =
        'Failed to load Python — please refresh the page.';
      loadingEl.querySelector('.spinner')?.remove();
      console.error(err);
    });
}

/* ------------------------------------------------------------------ */
/*  Run + Clear button handlers (delegated)                            */
/* ------------------------------------------------------------------ */

document.addEventListener('click', async (e) => {
  /* ▶ Run */
  if (e.target.matches('.run-btn')) {
    const taskId = e.target.dataset.task;
    if (!taskId || !pyodide) return;

    /* Disable ALL run buttons to prevent concurrent execution */
    document
      .querySelectorAll('.run-btn')
      .forEach((btn) => (btn.disabled = true));

    await runCode(pyodide, getCode(editors[taskId]), terminals[taskId]);

    document
      .querySelectorAll('.run-btn')
      .forEach((btn) => (btn.disabled = false));
  }

  /* Clear */
  if (e.target.matches('.clear-btn')) {
    const taskId = e.target.dataset.task;
    if (taskId && terminals[taskId]) {
      terminals[taskId].clear();
    }
  }
});

/* ------------------------------------------------------------------ */
/*  Focus-loss detection                                               */
/* ------------------------------------------------------------------ */

const focusModal = document.getElementById('focus-modal');

/*
 * Grace period: ignore blur/visibility events for a short window after
 * actions that legitimately steal focus (e.g. file download dialogs,
 * OS notifications). Also ignore brief flickers (< 2s) from OS-level
 * overlays like Spotlight, notification banners, or autofill popups.
 */
let focusSuppressedUntil = 0;

/** Suppress the focus-loss modal for the given duration (ms). */
function suppressFocusModal(ms = 3000) {
  focusSuppressedUntil = Date.now() + ms;
}

function shouldShowFocusModal() {
  if (isAnyModalOpen()) return false;
  if (Date.now() < focusSuppressedUntil) return false;
  return true;
}

let focusBlurTimer = null;

function scheduleFocusModal() {
  /* Wait a short moment — if focus returns quickly it was likely an
     OS-level overlay (Spotlight, notification, autofill) not a tab switch. */
  clearTimeout(focusBlurTimer);
  focusBlurTimer = setTimeout(() => {
    /* Re-check: user may have returned in the meantime */
    if (document.visibilityState === 'visible' && document.hasFocus()) return;
    if (!shouldShowFocusModal()) return;
    focusModal.classList.remove('hidden');
  }, 1500);
}

/* Cancel the timer when focus returns quickly */
window.addEventListener('focus', () => clearTimeout(focusBlurTimer));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    clearTimeout(focusBlurTimer);
  } else {
    scheduleFocusModal();
  }
});

window.addEventListener('blur', () => scheduleFocusModal());

document.getElementById('focus-continue').addEventListener('click', () => {
  focusModal.classList.add('hidden');
});

/* ------------------------------------------------------------------ */
/*  Service worker registration (offline support)                      */
/* ------------------------------------------------------------------ */

if ('serviceWorker' in navigator) {
  /* Collect all resource URLs the page depends on */
  function getPageResourceUrls() {
    const urls = new Set();
    urls.add(location.href);
    document.querySelectorAll('link[rel="stylesheet"][href]').forEach((el) =>
      urls.add(el.href),
    );
    document.querySelectorAll('script[src]').forEach((el) =>
      urls.add(el.src),
    );
    return [...urls];
  }

  /* On message from SW, send back our resource list for precaching */
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_URLS') {
      navigator.serviceWorker.controller?.postMessage({
        type: 'CACHE_URLS',
        urls: getPageResourceUrls(),
      });
    }
  });

  navigator.serviceWorker
    .register(data.basePath + 'sw.js')
    .then((reg) => {
      /* If SW already active (repeat visit), proactively cache now */
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_URLS',
          urls: getPageResourceUrls(),
        });
      }
      return reg;
    })
    .catch(() => {});
}
