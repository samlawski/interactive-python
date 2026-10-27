/* ===================================================================
   submission/baserow.js — Submission provider for Baserow
   ===================================================================
   Creates one row per submission through Baserow's REST API:
     POST <apiUrl>/api/database/rows/table/<tableId>/?user_field_names=true
   Works the same for baserow.io and a self-hosted Baserow.
   =================================================================== */

import { SubmissionError } from './errors.js';

/* Submission key → Baserow field name. The table needs these fields
   (text fields; "Answers" as Long text with rich text formatting
   turned off, so Baserow stores the Markdown unchanged). Extra fields such as a
   "Created on" field for the server time are fine. */
const FIELDS = {
  examId: 'Exam',
  email: 'Email',
  integrity: 'Integrity',
  submittedAt: 'Submitted at',
  content: 'Answers',
};

/** Whether all settings needed to reach the table are filled in. */
export function isConfigured(options) {
  return Boolean(options && options.apiUrl && options.tableId && options.token);
}

/** Turn a Baserow error response into a message for the student. */
function describeError(status) {
  if (status === 401 || status === 403) {
    return 'The submission server did not accept this site\'s access key. Please tell your teacher.';
  }
  if (status === 400 || status === 404) {
    return 'The submission table is not set up correctly. Please tell your teacher.';
  }
  if (status === 429) {
    return 'The submission server is busy right now. Please try again in a minute.';
  }
  return 'The submission server had a problem. Please try again in a minute.';
}

/** Create a row for the submission and return its row id as receipt. */
export async function submit(submission, options, signal) {
  const base = options.apiUrl.replace(/\/+$/, '');
  const url = `${base}/api/database/rows/table/${encodeURIComponent(options.tableId)}/?user_field_names=true`;

  const row = {};
  for (const [key, field] of Object.entries(FIELDS)) {
    row[field] = submission[key];
  }

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${options.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(row),
    cache: 'no-store',
    signal,
  });

  const body = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    console.error('Baserow submission failed', resp.status, body);
    throw new SubmissionError(describeError(resp.status), {
      retryable: resp.status === 429 || resp.status >= 500,
    });
  }

  return { id: body.id != null ? String(body.id) : '' };
}
