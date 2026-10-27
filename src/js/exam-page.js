/* ===================================================================
   exam-page.js — Entry point for exam pages
   ===================================================================
   Features:
   - Renders exam tasks with textareas or code editors
   - Code blocks rendered as canvas images (unselectable)
   - Independent editor/terminal pairs per task
   - Download answers as Markdown, or submit them to a backend
     (see submission/index.js) when one is configured
   - Copy/paste protection
   - Service worker registration for offline support
   =================================================================== */

import '../css/style.css';

import { createEditor, getCode } from './editor.js';
import { Terminal } from './terminal.js';
import { initPyodide, runCode } from './python-runner.js';
import { hmacHash } from './integrity.js';
import {
  isSubmissionEnabled,
  getPrivacyPolicyUrl,
  submitAnswers,
  SubmissionError,
} from './submission/index.js';

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
/*  Event log                                                          */
/* ------------------------------------------------------------------ */

const LOG_KEY = `exam-${data.id}-log`;
const eventLog = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');

function logEvent(label) {
  eventLog.push({ time: new Date().toISOString(), label });
  localStorage.setItem(LOG_KEY, JSON.stringify(eventLog));
}

logEvent('Page loaded');

let contentStartedLogged = false;
function logContentStart() {
  if (contentStartedLogged) return;
  contentStartedLogged = true;
  logEvent('First content interaction');
}

/* ------------------------------------------------------------------ */
/*  Enhance tasks                                                      */
/* ------------------------------------------------------------------ */

const examContainer = document.getElementById('exam-tasks');
const taskEls = Array.from(examContainer.querySelectorAll('.exam-task'));

/* Enhance each task (editors, textareas, canvas code blocks) */
const taskDataMap = Object.fromEntries(
  data.tasks.map((t) => [t.id, t]),
);

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
    const starterCode = (taskDataMap[taskId] && taskDataMap[taskId].starterCode) || '';
    buildEditorTerminal(answerArea, taskId, starterCode);
  } else {
    buildTextarea(answerArea, taskId);
  }
});

/* ------------------------------------------------------------------ */
/*  Spotlight — hash-based task navigation                             */
/* ------------------------------------------------------------------ */

if (taskEls.length >= 2) {
  examContainer.classList.add('has-spotlight');

  /* Insert Start button before the top download button */
  const startBtn = document.createElement('a');
  startBtn.className = 'btn btn-start-exam';
  startBtn.textContent = '▶ Start Exam';
  startBtn.href = '#' + taskEls[0].id;
  const topDownloadDiv = document.getElementById('download-top-btn').parentElement;
  topDownloadDiv.insertBefore(startBtn, topDownloadDiv.firstChild);

  taskEls.forEach((el, i) => {
    const nav = document.createElement('div');
    nav.className = 'task-nav';

    if (i > 0) {
      const prev = document.createElement('a');
      prev.className = 'btn btn-nav';
      prev.textContent = '← Previous Task';
      prev.href = '#' + taskEls[i - 1].id;
      nav.appendChild(prev);
    }

    if (i < taskEls.length - 1) {
      const next = document.createElement('a');
      next.className = 'btn btn-nav';
      next.textContent = 'Next Task →';
      next.href = '#' + taskEls[i + 1].id;
      nav.appendChild(next);
    }

    el.querySelector('.exam-task-body').appendChild(nav);
  });

/* Update start button label based on whether exam has been started */
  function updateStartBtn() {
    startBtn.textContent = location.hash ? '↑ Start at the top' : '▶ Start Exam';
  }
  updateStartBtn();
  window.addEventListener('hashchange', updateStartBtn);
}

/* Log hash-based navigation */
window.addEventListener('hashchange', () => {
  logEvent(`Navigated to task ${location.hash}`);
});

/* ------------------------------------------------------------------ */
/*  Textarea builder                                                   */
/* ------------------------------------------------------------------ */

function buildTextarea(container, taskId) {
  const textarea = document.createElement('textarea');
  textarea.className = 'exam-textarea';
  textarea.rows = 3;
  textarea.placeholder = 'Enter your answer here…';
  textarea.autocomplete = 'off';
  textarea.autocapitalize = 'off';
  textarea.setAttribute('autocorrect', 'off');
  textarea.spellcheck = false;

  /* Restore from localStorage */
  const saved = localStorage.getItem(`exam-${data.id}-${taskId}`);
  if (saved) textarea.value = saved;

  /* Auto-save on input */
  textarea.addEventListener('input', () => {
    logContentStart();
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

function buildEditorTerminal(container, taskId, starterCode) {
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
    localStorage.getItem(`exam-${data.id}-editor-${taskId}`) || starterCode || '';

  let saveTimer = null;
  const editor = createEditor(editorDiv, savedCode, (code) => {
    logContentStart();
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

  const fontSize = 16;
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
/*  Email prompt for submit / download                                 */
/* ------------------------------------------------------------------ */

const emailModal = document.getElementById('email-modal');
const emailInput = document.getElementById('email-input');
const emailConfirm = document.getElementById('email-confirm');
const emailCancel = document.getElementById('email-cancel');
const downloadLink = document.getElementById('email-download-link');
const submitStatus = document.getElementById('submit-status');

const SUBMIT_RECEIPT_KEY = `exam-${data.id}-submitted`;
const submissionEnabled = isSubmissionEnabled();

let isOnline = false;
let submitting = false;

/* Restore previously entered email */
const savedEmail = localStorage.getItem(`exam-${data.id}-email`);
if (savedEmail) emailInput.value = savedEmail;

/* With a submission backend: Submit is the main action, download a link */
if (submissionEnabled) {
  document.getElementById('email-text').textContent =
    'Enter your email, then submit your answers. You need to be online to submit.';
  emailConfirm.textContent = 'Submit';
  downloadLink.classList.remove('hidden');
  document.getElementById('submit-fine-print').classList.remove('hidden');
  const privacyUrl = getPrivacyPolicyUrl();
  if (privacyUrl) {
    document.getElementById('privacy-link').href = privacyUrl;
  } else {
    document.getElementById('privacy-link-wrap').remove();
  }
  ['download-top-btn', 'download-bottom-btn'].forEach((id) => {
    document.getElementById(id).textContent = '📤 Submit My Answers';
  });
}

/** Return the trimmed email, or null (and focus the field) if empty. */
function readEmail() {
  const email = emailInput.value.trim();
  if (!email) {
    emailInput.focus();
    return null;
  }
  localStorage.setItem(`exam-${data.id}-email`, email);
  return email;
}

/** Show a status line in the modal: kind is offline | pending | success | error. */
function showSubmitStatus(kind, message) {
  submitStatus.className = `submit-status submit-status-${kind}`;
  submitStatus.textContent = message;
}

function hideSubmitStatus() {
  submitStatus.className = 'submit-status hidden';
  submitStatus.textContent = '';
}

/** Return the receipt of the last successful submission, or null. */
function getLastReceipt() {
  return JSON.parse(localStorage.getItem(SUBMIT_RECEIPT_KEY) || 'null');
}

/** Describe a receipt for the student, e.g. "at 14:32 (receipt #42)". */
function describeReceipt(receipt) {
  const time = new Date(receipt.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `at ${time}${receipt.id ? ` (receipt #${receipt.id})` : ''}`;
}

/** Show the receipt of the last successful submission, if any. */
function showLastReceipt() {
  const receipt = getLastReceipt();
  if (!receipt) return false;
  showSubmitStatus('success', `✅ Submitted ${describeReceipt(receipt)}.`);
  return true;
}

/** Enable Submit only while online; explain why it is disabled. */
function updateSubmitAvailability() {
  if (!submissionEnabled || submitting) return;
  emailConfirm.disabled = !isOnline;
  if (!isOnline) {
    showSubmitStatus('offline', '📡 You are offline. Turn on your WiFi to submit.');
  } else if (submitStatus.classList.contains('submit-status-offline')) {
    if (!showLastReceipt()) hideSubmitStatus();
  }
}

/** Called by the connectivity check whenever it has a result. */
function onConnectivityChange(online) {
  isOnline = online;
  updateSubmitAvailability();
}

function promptAndDownload() {
  emailModal.classList.remove('hidden');
  if (submissionEnabled && !submitting) {
    if (!showLastReceipt()) hideSubmitStatus();
    updateSubmitAvailability();
    checkConnectivity();
  }
  emailInput.focus();
}

emailCancel.addEventListener('click', () => {
  emailModal.classList.add('hidden');
});

emailModal.addEventListener('click', (e) => {
  if (e.target === emailModal) emailModal.classList.add('hidden');
});

emailConfirm.addEventListener('click', () => {
  const email = readEmail();
  if (!email) return;
  if (submissionEnabled) {
    const receipt = getLastReceipt();
    if (receipt) {
      confirmResubmit(email, receipt);
    } else {
      submitToBackend(email);
    }
  } else {
    emailModal.classList.add('hidden');
    downloadAnswers(email);
  }
});

downloadLink.addEventListener('click', () => {
  const email = readEmail();
  if (!email) return;
  emailModal.classList.add('hidden');
  downloadAnswers(email);
});

/* --- Resubmit confirmation --------------------------------------- */

const resubmitModal = document.getElementById('resubmit-modal');
let pendingResubmitEmail = null;

/** Ask before sending a second version after a successful submission. */
function confirmResubmit(email, receipt) {
  if (submitting) return;
  pendingResubmitEmail = email;
  document.getElementById('resubmit-message').textContent =
    `You already submitted your answers successfully ${describeReceipt(receipt)}.`;
  resubmitModal.classList.remove('hidden');
  document.getElementById('resubmit-cancel').focus();
}

function closeResubmit() {
  pendingResubmitEmail = null;
  resubmitModal.classList.add('hidden');
}

document.getElementById('resubmit-cancel').addEventListener('click', closeResubmit);

resubmitModal.addEventListener('click', (e) => {
  if (e.target === resubmitModal) closeResubmit();
});

document.getElementById('resubmit-confirm').addEventListener('click', () => {
  const email = pendingResubmitEmail;
  closeResubmit();
  if (email) submitToBackend(email);
});

/** Send the answers to the submission backend and show the outcome. */
async function submitToBackend(email) {
  if (submitting) return;
  submitting = true;
  emailConfirm.disabled = true;
  showSubmitStatus('pending', '⏳ Submitting your answers…');

  try {
    const { md, hash, timestamp } = await buildAnswers(email, 'Content submitted');
    const receipt = await submitAnswers({
      examId: data.id,
      email,
      integrity: hash,
      submittedAt: timestamp,
      content: md,
    });
    localStorage.setItem(
      SUBMIT_RECEIPT_KEY,
      JSON.stringify({ id: receipt.id, at: new Date().toISOString() }),
    );
    logEvent(`Submission confirmed${receipt.id ? ` (receipt #${receipt.id})` : ''}`);
    showLastReceipt();
    emailCancel.textContent = 'Close';
  } catch (err) {
    logEvent('Submission failed');
    console.error(err);
    const message = err instanceof SubmissionError
      ? err.message
      : 'Something went wrong while submitting.';
    showSubmitStatus('error', `❌ ${message} If it keeps failing, download a copy instead and email it to the assessor.`);
  } finally {
    submitting = false;
    updateSubmitAvailability();
  }
}

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

  /* Resubmit modal (sits above the email modal): Escape cancels.
     Enter is left to the focused button, which defaults to Cancel. */
  if (!resubmitModal.classList.contains('hidden')) {
    if (e.key === 'Escape') closeResubmit();
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

/* ------------------------------------------------------------------ */
/*  Answers as Markdown (download + submit)                            */
/* ------------------------------------------------------------------ */

/**
 * Build the answers Markdown with its integrity hash. Download and
 * submit both use this, so a submission is exactly the file a download
 * at that moment would produce. `logLabel` is only added to the
 * activity log. Returns { md, hash, timestamp }.
 */
async function buildAnswers(email, logLabel) {
  let md = `# ${data.title}\n\n`;
  md += `**Email:** ${email}\n\n`;
  const now = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  md += `**Downloaded:** ${now.toISOString()} (${tz})\n\n`;
  md += `**Device:** ${navigator.userAgent}\n\n`;
  const integrityInsertPos = md.length;
  md += `⚠️⚠️ VERY IMPORTANT: Do not edit this file! An integrity key is used to detect tampering. ⚠️⚠️\n\n`;
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

  logEvent(logLabel);

  md += '## Activity Log\n\n';
  md += '| # | Timestamp | Event |\n';
  md += '|---|-----------|-------|\n';
  eventLog.forEach((entry, i) => {
    md += `| ${i + 1} | ${entry.time} | ${entry.label} |\n`;
  });
  md += '\n';

  /* Integrity hash — inserted into the meta header at the top */
  const hash = await hmacHash(md);
  const integrityLine = `**Integrity:** ${hash}\n\n`;
  md = md.slice(0, integrityInsertPos) + integrityLine + md.slice(integrityInsertPos);

  return { md, hash, timestamp: now.toISOString() };
}

/** Download the answers as a Markdown file. */
async function downloadAnswers(email) {
  const { md } = await buildAnswers(email, 'Content downloaded');

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
let focusTimerInterval = null;
let focusTimerStart = 0;
const focusTimerEl = document.getElementById('focus-timer');

function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

function startFocusTimer() {
  if (focusTimerInterval) return; /* already running */
  focusTimerStart = Date.now();
  focusTimerEl.textContent = '0:00';
  focusTimerInterval = setInterval(() => {
    focusTimerEl.textContent = formatElapsed(Date.now() - focusTimerStart);
  }, 1000);
}

function stopFocusTimer() {
  clearInterval(focusTimerInterval);
  focusTimerInterval = null;
  const elapsed = focusTimerStart ? Date.now() - focusTimerStart : 0;
  focusTimerStart = 0;
  focusTimerEl.textContent = '0:00';
  return elapsed;
}

function showFocusModal() {
  focusModal.classList.remove('hidden');
  startFocusTimer();
}

function scheduleFocusModal() {
  /* Wait a short moment — if focus returns quickly it was likely an
     OS-level overlay (Spotlight, notification, autofill) not a tab switch. */
  if (!focusModal.classList.contains('hidden')) return; /* modal already open */
  clearTimeout(focusBlurTimer);
  focusBlurTimer = setTimeout(() => {
    /* Re-check: user may have returned in the meantime */
    if (document.visibilityState === 'visible' && document.hasFocus()) return;
    if (!shouldShowFocusModal()) return;
    showFocusModal();
  }, 2500);
}

/* Cancel the pending timer when focus returns quickly */
window.addEventListener('focus', () => {
  clearTimeout(focusBlurTimer);
  logEvent('Page regained focus');
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    clearTimeout(focusBlurTimer);
    logEvent('Page regained focus');
  } else {
    logEvent('👀 Page lost focus');
    scheduleFocusModal();
  }
});

window.addEventListener('blur', () => {
  logEvent('👀 Page lost focus');
  scheduleFocusModal();
});

document.getElementById('focus-continue').addEventListener('click', () => {
  const elapsed = stopFocusTimer();
  focusModal.classList.add('hidden');
  logEvent(`Focus modal dismissed after ${formatElapsed(elapsed)}`);
});

/* ------------------------------------------------------------------ */
/*  Online status indicator + connectivity ping                        */
/* ------------------------------------------------------------------ */

const onlineBorder = document.createElement('div');
onlineBorder.className = 'online-border';
document.body.appendChild(onlineBorder);

const onlineIndicator = document.createElement('div');
onlineIndicator.className = 'online-indicator';
onlineIndicator.innerHTML = '<span class="status-dot"></span><span class="status-label">Offline</span>';
document.body.appendChild(onlineIndicator);

const statusLabel = onlineIndicator.querySelector('.status-label');

let lastOnlineState = null;

function setOnlineStatus(online) {
  if (lastOnlineState !== online) {
    if (lastOnlineState !== null) {
      logEvent(online ? '🔌 Page went online' : 'Page went offline');
    }
    lastOnlineState = online;
  }
  onConnectivityChange(online);
  if (online) {
    onlineBorder.classList.add('visible');
    onlineIndicator.className = 'online-indicator online';
    statusLabel.textContent = 'You are online';
  } else {
    onlineBorder.classList.remove('visible');
    onlineIndicator.className = 'online-indicator offline';
    statusLabel.textContent = 'Offline';
  }
}

async function checkConnectivity() {
  try {
    /* Append a unique _ping param so the service worker never serves
       this request from cache — guaranteeing a real network round-trip. */
    const pingUrl = `${window.location.href.split('?')[0]}?_ping=${Date.now()}`;
    const resp = await fetch(pingUrl, {
      method: 'HEAD',
      cache: 'no-store',
    });
    setOnlineStatus(resp.ok);
  } catch {
    setOnlineStatus(false);
  }
}

/* Initial check + periodic ping every 5 seconds */
checkConnectivity();
setInterval(checkConnectivity, 5000);

/* ------------------------------------------------------------------ */
/*  Service worker registration (offline support)                      */
/* ------------------------------------------------------------------ */

if ('serviceWorker' in navigator) {
  /* True on the very first visit: no SW controls this page yet, so none
     of its requests — including ES-module chunks like python-runner.js,
     which never appear as a <script> element and are invisible to
     getPageResourceUrls() below — are intercepted or cached by the fetch
     handler. Once the newly-installed SW activates and claims this page,
     force a single reload so the reload (and everything it fetches) goes
     through the SW's fetch handler and gets cached, leaving the page
     fully usable offline right away. Only do this on the very first
     visit — later SW updates must never force a reload mid-exam. */
  const isFirstVisit = !navigator.serviceWorker.controller;
  if (isFirstVisit) {
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => window.location.reload(),
      { once: true },
    );
  }

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
    /* Pyodide fetches these internally — they would miss the SW on the
       very first visit (race condition), so explicitly request caching.
       SW install-time precaching also covers this, but belt-and-suspenders. */
    if (hasEditors) {
      const pyBase = new URL(data.basePath + 'pyodide/', location.href).href;
      ['pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'].forEach(
        (f) => urls.add(pyBase + f),
      );
    }
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
