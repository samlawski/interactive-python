/* ===================================================================
   assignment-page.js — Entry point for assignment pages
   =================================================================== */

import '../css/style.css';

import * as storage from './storage.js';

/* ------------------------------------------------------------------ */
/*  Bootstrap                                                          */
/* ------------------------------------------------------------------ */

const data = JSON.parse(
  document.getElementById('assignment-data').textContent,
);

/* ------------------------------------------------------------------ */
/*  Exercise status indicators                                         */
/* ------------------------------------------------------------------ */

function updateStatusIcons() {
  for (const ex of data.exercises) {
    const icon = document.getElementById(`status-${ex.id}`);
    if (!icon) continue;
    if (storage.isDone(ex.id)) {
      icon.textContent = '✅';
      icon.title = 'Completed';
    } else if (storage.hasWorkedOn(ex.id)) {
      icon.textContent = '📝';
      icon.title = 'In progress';
    } else {
      icon.textContent = '⬜';
      icon.title = 'Not started';
    }
  }
}

updateStatusIcons();

/* Re-check when the tab gains focus (student may have been working
   in another tab). */
window.addEventListener('focus', updateStatusIcons);

/* ------------------------------------------------------------------ */
/*  Download all code                                                  */
/* ------------------------------------------------------------------ */

document.getElementById('download-btn').addEventListener('click', () => {
  const divider = '#'.repeat(60);
  let content = `# ${data.title}\n`;
  content += `# Downloaded on ${new Date().toLocaleDateString()}\n\n`;

  for (const ex of data.exercises) {
    const code = storage.getCode(ex.id) || ex.startCode || '# (no code yet)\n';
    content += `${divider}\n`;
    content += `# Exercise: ${ex.title}\n`;
    content += `${divider}\n\n`;
    content += code.trimEnd() + '\n\n\n';
  }

  const blob = new Blob([content], { type: 'text/x-python' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.id}.py`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});
