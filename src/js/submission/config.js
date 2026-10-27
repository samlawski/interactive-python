/* ===================================================================
   submission/config.js — Which backend receives exam submissions
   ===================================================================
   `provider` names a provider registered in index.js. Set it to '' (or
   leave its settings empty) to turn submitting off; students can then
   only download their answers, like before.

   Everything in this file ships to the browser and is public. Only put
   credentials here that are safe to expose. For Baserow that is a
   database token that may *only create rows* in the submissions table
   (see "Exam submission" in README.md).
   =================================================================== */

export const SUBMISSION_CONFIG = {
  provider: 'baserow',

  baserow: {
    apiUrl: 'https://api.baserow.io', /* or your self-hosted Baserow URL */
    tableId: '1283418',
    token: 'iksJvEsqf8xMi9KFR3fGxaY6WLDSwA76',
    /* Linked in the fine print under the Submit button */
    privacyPolicyUrl: 'https://baserow.io/privacy-policy',
  },
};
