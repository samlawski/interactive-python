/* ===================================================================
   submission/index.js — Send exam answers to a submission backend
   ===================================================================
   The exam page only talks to this module. It hands over a submission
   and gets back a receipt, or a SubmissionError with a message for the
   student. Which backend receives it is set in config.js.

   Submission shape (what the exam page passes in):
     {
       examId,       e.g. 'test'
       email,        the student's email address
       integrity,    the HMAC hash, same as the **Integrity:** line
       submittedAt,  ISO timestamp from the student's device
       content,      the full Markdown, identical to the download
     }

   Provider contract (one module per backend, e.g. baserow.js):
     isConfigured(options)               → boolean
     submit(submission, options, signal) → Promise<{ id: string }>
   A provider throws SubmissionError when the server answers with an
   error. Network failures surface as the usual fetch errors and are
   retried here, so providers don't need their own retry logic.

   To add a backend: write <name>.js with that contract, register it in
   PROVIDERS below and point config.js at it.
   =================================================================== */

import { SUBMISSION_CONFIG } from './config.js';
import { SubmissionError } from './errors.js';
import * as baserow from './baserow.js';

export { SubmissionError };

const PROVIDERS = { baserow };

const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 20000;

/** Return the configured provider module, or null if submission is off. */
function getProvider() {
  const provider = PROVIDERS[SUBMISSION_CONFIG.provider];
  if (!provider) return null;
  return provider.isConfigured(SUBMISSION_CONFIG[SUBMISSION_CONFIG.provider])
    ? provider
    : null;
}

/** Whether this build can submit answers (otherwise: download only). */
export function isSubmissionEnabled() {
  return getProvider() !== null;
}

/** Privacy policy URL of the configured backend, or '' if none is set. */
export function getPrivacyPolicyUrl() {
  if (!isSubmissionEnabled()) return '';
  return SUBMISSION_CONFIG[SUBMISSION_CONFIG.provider].privacyPolicyUrl || '';
}

/** Wait before the next attempt: ~1s, then ~2s, with random jitter. */
function backoff(attempt) {
  const delay = 1000 * 2 ** (attempt - 2) + Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Send a submission to the configured backend.
 * Retries network failures and retryable server errors a few times.
 * Resolves with the backend's receipt `{ id }`.
 */
export async function submitAnswers(submission) {
  const provider = getProvider();
  if (!provider) {
    throw new SubmissionError('Submitting is not set up for this exam.');
  }
  const options = SUBMISSION_CONFIG[SUBMISSION_CONFIG.provider];

  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) await backoff(attempt);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await provider.submit(submission, options, controller.signal);
    } catch (err) {
      if (err instanceof SubmissionError && !err.retryable) throw err;
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }

  if (lastError instanceof SubmissionError) throw lastError;
  throw new SubmissionError(
    'Could not reach the submission server. Check your WiFi and try again.',
    { retryable: true, cause: lastError },
  );
}
