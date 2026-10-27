/* ===================================================================
   submission/errors.js — Error type shared by all providers
   =================================================================== */

/**
 * An error the student should see. `retryable` marks failures where
 * trying again may help (server busy, server error); everything else
 * (bad token, wrong table setup) fails right away.
 */
export class SubmissionError extends Error {
  constructor(message, { retryable = false, cause } = {}) {
    super(message, { cause });
    this.name = 'SubmissionError';
    this.retryable = retryable;
  }
}
